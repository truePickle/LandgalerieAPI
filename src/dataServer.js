import sql from "/src/database.js";

export class dataServer {
    //getters
    async get_all_paintings() {
        // use to get pics and images simultanious await Promise.all([]);
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
        const authorExists = sql`SELECT * FROM author WHERE name = ${Name}`;
        if(authorExists === null){
            sql`INSERT ${Name} INTO authors`
            return true;
        }
        throw new Error("Author already exists");
    }
    insert_description(Description){
        sql`INSERT ${Description} into descriptions`
    }
    insert_image(Image){
        sql`INSERT ${Image} into images`
    }

}
