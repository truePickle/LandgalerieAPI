import sql from "/src/database.js";
import * as bun from "bun";
import path from "path";

export class dataServer {
    //getters
    async get_all_paintings(){
        return sql`SELECT * FROM paintings`;
    }
    async get_painting_description(id){
        return  sql`SELECT description FROM paintings WHERE id=${id}`;
    }
    async get_painting_image(id){
        const imageID = sql`
            SELECT imageId From paintings WHERE id = ${id}`
        return sql`SELECT image FROM images WHERE id = ${imageID}`
    }
    //inserts
    async insert_user(Data) {
        const hashPassword = await bun.password.hash(Data.password, "argon2d");

        if (Data.hasOwnProperty("isAdmin") && Data.hasOwnProperty("isArtist")) {
            sql`INSERT INTO users (vorname, nachname, email, password, isAdmin, isArtist) 
            VALUES (${Data.lastname}, ${Data.firstname}, ${Data.email}, ${hashPassword}, ${Data.isAdmin}, ${Data.isArtist})`
        } else if (Data.hasOwnProperty("isAdmin")) {
            sql`INSERT INTO users (vorname, nachname, email, password, isAdmin) 
            VALUES (${Data.lastname}, ${Data.firstname}, ${Data.email}, ${hashPassword}, ${Data.isAdmin})`
        } else if (Data.hasOwnProperty("isArtist")) {
            sql`INSERT INTO users (vorname, nachname, email, password, isArtist) 
            VALUES (${Data.lastname}, ${Data.firstname}, ${Data.email}, ${hashPassword}, ${Data.isArtist})`
        } else {
            sql`INSERT INTO users (vorname, nachname, email, password) 
            VALUES (${Data.lastname}, ${Data.firstname}, ${Data.email}, ${hashPassword})`
        }
    }
    async insert_painting(Data){
        let id;

        if(Data.hasOwnProperty("description") && Data.hasOwnProperty("price")){
            id = sql`INSERT INTO table paintings (artistID, description, price)
                OUTPUT Inserted.ID
                VALUES(Data.artistID, Data.description, Data.price);`
        } else if(Data.hasOwnProperty("description")) {
            id = sql`INSERT INTO table paintings (artistID, description)
                OUTPUT Inserted.ID
                VALUES(Data.artistID, Data.description);`
        }else if(Data.hasOwnProperty("price")) {
            id = sql`INSERT INTO table paintings (artistID, price)
                OUTPUT Inserted.ID
                VALUES(Data.artistID, Data.price);`
        }else{
            id = sql`INSERT INTO table paintings (artistID)
                OUTPUT Inserted.ID
                VALUES(Data.artistID);`
        }

        return id;
    }
    async insert_image(Data){
        let Filepath = path.basename("./Data/images");
        Filepath = path.join(Filepath, Data.name);

        const promise = bun.write(Filepath, Data.image);
        sql`INSERT INTO images (painting_id, name, path, type) VALUES (${Data.paintingId}, ${Data.name}, ${path}, ${Data.type})`;
        await promise;
    }

    //verify password
    async verify_password(Data){
        const hashPassword = sql`
            SELECT password FROM users WHERE email=${Data.email}`
        return await bun.password.verify(Data.password, hashPassword);
    }
    async verify_admin(Data){
        return sql`
            SELECT isAdmin FROM users WHERE email=${Data.email}`;
    }
    async verify_artist(Data){
        return sql`
            SELECT isArtist FROM users WHERE email=${Data.email}`;
    }
    async verify_email(Data){
        return sql`
            SELECT * FROM users WHERE email=${Data.email}`;
    }

    //update Functions
    async update_description(Data){
        sql`INSERT INTO paintings (description) VALUES (${Data.description} WHERE id=${Data.id})`
    }
    async update_price(Data){
        sql`INSERT INTO paintings (price) VALUES (${Data.price} WHERE id=${Data.id})`
    }
    async update_isAdmin(Data){
        sql`INSERT INTO users (isAdmin) VALUES (${Data.isAdmin} WHERE email=${Data.email})`
    }
    async update_isArtist(Data){
        sql`INSERT INTO users (isArtist) VALUES (${Data.isArtist} WHERE email=${Data.email})`
    }
}
