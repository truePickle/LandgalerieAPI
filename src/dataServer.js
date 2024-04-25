import { Room } from "/src/Room.js";
import sql from "/src/database.js";

export class dataServer {
    //getters
    get_all_paintings(){
        return sql`
            SELECT * FROM paintings`;
    }
    get_painting_description(id){
        return  sql`
            SELECT description FROM paintings WHERE id=${id}`;
    }
    get_painting_image(id){
        const imageID = sql`
            SELECT imageId From paintings WHERE id = ${id}`
        return sql`
            SELECT image FROM images WHERE id = ${imageID}`
    }
    //inserts
    insert_author(Name){
        const authorExists = sql`SELECT * FROM author WHERE name = ${Name}`
        if(authorExists.length === 0){
            sql`INSERT ${Name} INTO authors`
        }
    }
    insert_description(Description){
        sql`INSERT ${Description} into descriptions`
    }
    insert_painting(image){}

}
