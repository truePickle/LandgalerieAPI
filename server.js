import express from "express";
import { WebSocketServer } from "ws";
import { Room } from "./src/Room.js";
import { dataServer } from "./src/dataServer.js";

const database = dataServer();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Create a WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Map of room names to Room instances
const rooms = new Map();

wss.on("connection", (ws, req) => {
    const roomName = req.url.substring(1); // Get the room name from the URL
    let room = rooms.get(roomName);

    // If the room doesn't exist, create it
    if (!room) {
        console.log(`Creating room: ${roomName}`);
        room = new Room(roomName);
        rooms.set(roomName, room);
    }

    // Add the client to the room
    room.join(ws);

    ws.on("message", (message) => {
        // When a message is received, send it to all clients in the room
        console.log("Received:", message);
        room.send(message);
    });

    ws.on("close", () => {
        // When the client disconnects, remove them from the room
        room.leave(ws);
    });
});
//API requests
app.get("/", (req, res) => {
    const data = database.get_all_paintings();
    res.send(data);
});

app.get("/:key", (req, res) => {
    const key = req.params.key;
    const image = database.get_painting_image(key);
    const description = database.get_painting_description(key);
    res.send({
        "description": description,
        "image": image
        });
});

app.get("/:key/image", (req, res) => {
    const data = database.get_painting_image(req.params.key);
    res.send(data);
});

app.get("/:key/description", (req, res) =>{
    const data = database.get_painting_description(req.param.key);
    res.send(data);
});

app.get("/:room/chat", (req, res) => {
    // Upgrade the HTTP connection to a WebSocket connection
    console.log("New Socket connection");
    //upgrade http connection to a websocket connection
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});