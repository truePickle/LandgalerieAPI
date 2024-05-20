import sql from "./database.js";
import * as bun from "bun";
import path from "path";
import crypto from "crypto";
import config from "../config.js";

export class dataServer {
    //logged in user
    #users = null;
    #admins = null;
    #artists = null;
    #basePathImage = process.env.BASEPATHIMAGE || config.api.basePathImage || "/Data/images";

    //getters
    /**
     * @returns {Array}
     */
    async get_all_paintings(){
        return sql`SELECT * FROM paintings`;
    }
    /**
     * @param {number} id
     * @returns {string}
     */
    async get_painting_description(id){
        return  sql`SELECT description FROM paintings WHERE id=${id}`;
    }
    /**
     * @param {number} id
     * @returns {string}
     */
    async get_painting_images(id){
        const images = [];
        const imagePaths =await sql`SELECT path FROM images WHERE painting_id = ${id}`;
        for (const imagePath of imagePaths) {
            images.append((await bun.file(imagePath).arrayBuffer()).toString());
        }
        return images;
    }

    //inserts
    /**
     *
     * @param {Object} Data
     * @param {string} Data.firstname
     * @param {string} Data.lastname
     * @param {string} Data.email
     * @param {string} Data.password
     * @param {boolean} Data.isAdmin
     * @param {boolean} Data.isArtist
     */
    async insert_user(Data) {
        const hashPassword = await bun.password.hash(Data.password, "argon2d");
        let id;
        if (Data.hasOwnProperty("isAdmin") && Data.hasOwnProperty("isArtist")) {
            id = sql`INSERT INTO users (vorname, nachname, email, password, isAdmin, isArtist)
            OUTPUT Inserted.ID
            VALUES (${Data.firstname}, ${Data.lastname}, ${Data.email}, ${hashPassword}, ${Data.isAdmin}, ${Data.isArtist})`
        } else if (Data.hasOwnProperty("isAdmin")) {
            id = sql`INSERT INTO users (vorname, nachname, email, password, isAdmin) 
            OUTPUT Inserted.ID
            VALUES (${Data.firstname}, ${Data.lastname}, ${Data.email}, ${hashPassword}, ${Data.isAdmin})`
        } else if (Data.hasOwnProperty("isArtist")) {
            id = sql`INSERT INTO users (vorname, nachname, email, password, isArtist) 
            OUTPUT Inserted.ID
            VALUES (${Data.firstname}, ${Data.lastname}, ${Data.email}, ${hashPassword}, ${Data.isArtist})`
        } else {
            id = sql`INSERT INTO users (vorname, nachname, email, password) 
            OUTPUT Inserted.ID
            VALUES (${Data.firstname}, ${Data.lastname}, ${Data.email}, ${hashPassword})`
        }
        return id;
    }
    /**
     *
     * @param {Object} Data
     * @param {string} Data.artistID
     * @param {string} Data.description
     * @param {string} Data.price
     * @returns {number} Paintingid
     */
    async insert_painting(Data){
        let id;

        if(Data.hasOwnProperty("description") && Data.hasOwnProperty("price")){
            id = sql`INSERT INTO table paintings (description, price)
                OUTPUT Inserted.ID
                VALUES(${Data.description}, ${Data.price});`
        } else if(Data.hasOwnProperty("description")) {
            id = sql`INSERT INTO table paintings (description)
                OUTPUT Inserted.ID
                VALUES(${Data.description});`
        }else if(Data.hasOwnProperty("price")) {
            id = sql`INSERT INTO table paintings (price)
                OUTPUT Inserted.ID
                VALUES(${Data.price});`
        }else{
            id = sql`INSERT INTO table paintings
                OUTPUT Inserted.ID
                VALUES();`
        }

        return id;
    }
    /**
     *
     * @param {Object} Data
     * @param {string} Data.name
     * @param {string} Data.type
     * @param {number} Data.paintingId
     * @param {string} Data.image
     */
    async insert_image(Data){
        let Filepath = path.basename(this.#basePathImage);
        Filepath = path.join(Filepath, Data.paintingId.toString(), Data.name);

        const promise = bun.write(Filepath, Data.image);
        sql`INSERT INTO images (painting_id, name, path, type) 
            VALUES (${Data.paintingId}, ${Data.name}, ${Filepath}, ${Data.type})`;
        await promise;
    }

    //verify password
    /**
     *
     * @param {Object} Data
     * @param {string} Data.email
     * @param {string} Data.password
     * @returns {string|boolean}
     */
    async verify_password(Data) {

        const hashPassword = await sql`
            SELECT password FROM users WHERE email=${Data.email}`
        if (await bun.password.verify(Data.password, hashPassword)) {
            const cookie = crypto.randomBytes(32).toString("hex");
            if(this.#verify_admin(Data.email)){
               this.#admins.append(cookie);
            }
            if(this.#verify_artist(Data.email)){
                this.#artists.append(cookie);
            }
            this.#users.append(cookie);
            return cookie;
        }
        return false;
    }
    /**
     * @param {string} email
     * @returns {boolean}
     */
    async #verify_admin(email){
        return sql`
            SELECT isAdmin FROM users WHERE email=${email}`;
    }
    /**
     *
     * @param {string} email
     * @returns {boolean}
     */
    async #verify_artist(email){
        return sql`
            SELECT isArtist FROM users WHERE email=${email}`;
    }
    /**
     *
     * @param {string} email
     * @returns {boolean}
     */
    async #verify_email(email){
        const emailExists = await sql`
            SELECT * FROM users WHERE email=${email}`;
        return !!emailExists;

    }

    //update Functions
    /**
     *
     * @param {Object} Data
     * @param {number} Data.id
     * @param {string} Data.description
     */
    async update_description(Data){
        sql`INSERT INTO paintings (description) VALUES (${Data.description} WHERE id=${Data.id})`
    }
    /**
     *
     * @param {Object} Data
     * @param {number} Data.id
     * @param {number} Data.price
     */
    async update_price(Data){
        sql`INSERT INTO paintings (price) VALUES (${Data.price} WHERE id=${Data.id})`
    }
    /**
     *
     * @param {Object} Data
     * @param {string} Data.isAdmin
     * @param {string} Data.email
     */
    async update_isAdmin(Data){
        sql`INSERT INTO users (isAdmin) VALUES (${Data.isAdmin} WHERE email=${Data.email})`
    }
    /**
     *
     * @param {Object} Data
     * @param {string} Data.isArtist
     * @param {string} Data.email
     */
    async update_isArtist(Data){
        sql`INSERT INTO users (isArtist) VALUES (${Data.isArtist} WHERE email=${Data.email})`
    }
}
