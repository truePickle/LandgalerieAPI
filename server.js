import express from "express";
import { password } from "bun";
import { dataServer } from "./src/dataServer.js";

const database = new dataServer();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

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
    const data = database.get_painting_description(req.params.key);
    res.send(data);
});
//user management
app.put("/create/user", async (req, res) => {
    const data = req.body;

    if (hasProperties(data, "surname", "lastname", "password", "role")) {
        try {
            const hash = await password.hash(data.password);

            database.insert_author(data.surname, data.lastname, hash, data.role);
        } catch (error) {
            res.send({
                "code": 500,
                "message": error.message
            });
        }
        res.send({
            "code": 200,
            "message": "User created"
        });
    }
    res.send({
        "code": 400,
        "message": "Invalid Data needs to have surname, lastname, password, role"
    });
});
//painting management
app.put("/create/painting", (req, res) => {
    const data = req.body;
    if(hasProperties("description", "image", "author")){
        try {
            database.insert_image(data.description);
        } catch (error) {
            res.send({
                "code": 500,
                "message": error.message
            });
        }
        res.send({
            "code": 200,
            "message": "Painting created"
        });
    }
    res.send({
        "code": 400,
        "message":"Invalid Data needs to have description, image, author"
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});