import express from "express";
import { dataServer } from "./src/dataServer.js";

const database = new dataServer();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const invalidRequestMessage = {
    "code": 400,
    "message": "Invalid request body needs to have email and password"
};

function interalErrorMessage(error) {
    return {
        "code": 500,
        "message": error.message
    };
}

function hasProperties(obj, ...properties){
    for(const property of properties){
        if(!obj.hasOwnProperty(property)){
            return false;
        }
    }
    return true;
}

//API requests
//painting requests
app.get("/paintings", (req, res) => {
    const data = database.get_all_paintings();
    const answer = {
        "code": 200,
        "paintings": data
    }
    res.send(answer);
});

app.get("/paintings/:key", (req, res) => {
    let image;
    let description;
    try {
        const key = req.params.key;
        image = database.get_painting_image(key);
        description = database.get_painting_description(key);
    } catch (error) {
        res.send(interalErrorMessage(error));
    }
    res.send({
        "code": 200,
        "description": description,
        "image": image
        });
});

app.get("/paintings/:key/image", (req, res) => {
    const data = database.get_painting_images(req.params.key);
    const anwser = {
        "code": 200,
        "image": data
    }
    res.send(anwser);
});

app.get("/paintings/:key/description", (req, res) =>{
    const data = database.get_painting_description(req.params.key);
    const anwser = {
        "code": 200,
        "description": data
    }
    res.send(anwser);
});
//user management
app.get("/login", (req, res) => {
    const user = req.body;
    if(hasProperties(user, "email", "password")){
        try {
            const authCookie = database.verify_password(user)
            if(authCookie){
                res.send({
                    "code": 200,
                    "cookie": authCookie,
                    "message": "Logged in"
                });
            }
        } catch (error) {
            res.send(interalErrorMessage(error));
        }
    }
    res.send(invalidRequestMessage);
});
app.put("/create/user", async (req, res) => {
    const user = req.body;

    if (hasProperties(user, "firstrname", "lastname", "email", "password")) {
        try {
            await database.insert_user(user);
        } catch (error) {
            res.send(interalErrorMessage(error));
        }
        res.send({
            "code": 200,
            "message": "User created"
        });
    }
    res.send(invalidRequestMessage);
});
//painting management
app.put("/create/painting", (req, res) => {
    const data = req.body;
    if(hasProperties("description", "", "author")){
        let id;
        try {
            id = database.insert_painting(data);
        } catch (error) {
            res.send(interalErrorMessage(error));
        }
        res.send({
            "code": 200,
            "id": id,
            "message": "Painting created"
        });
    }
    res.send(invalidRequestMessage);
});
//adding image
app.put("/create/image", async (req, res) => {
    const data = req.body;
    if (hasProperties(data, "image", "paintingId")) {
        const insertPromise = database.insert_image(data).catch(error => {
            res.send(interalErrorMessage(error));
        });
        await insertPromise;
        res.send({
            "code": 200,
            "message": "Image created"
        });
    }
    res.send(invalidRequestMessage);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});