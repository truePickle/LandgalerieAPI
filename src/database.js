import  postgres from 'postgres';
import conf from '../config.js';
const hostname = process.env.DBHOST||conf.db.url;
const sql = postgres(`postgres://${hostname}`, {
    host                 : hostname,           // Postgres ip address[s] or domain name[s]
    port                 : process.env.DBPORT||conf.db.port,                            // Postgres server port[s]
    database             : process.env.DBNAME||conf.db.database,                     // Name of database to connect to
    username             : process.env.DBUSER||conf.db.username,                           // Username of database user
    password             : process.env.DBPWD||conf.db.password,                 // Password of database user
});
export default sql;