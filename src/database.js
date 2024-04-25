import  postgres from 'postgres';
import conf from '../config.js';
const hostname = process.env.DBHOST||"noah.nat.selfnet.de";
const sql = postgres(`postgres://${hostname}`, {
    host                 : hostname,           // Postgres ip address[s] or domain name[s]
    port                 : process.env.DBPORT||"5432",                            // Postgres server port[s]
    database             : process.env.DBNAME||"langalery",                     // Name of database to connect to
    username             : process.env.DBUSER||"api",                           // Username of database user
    password             : process.env.DBPWD||"pineapple1924",                 // Password of database user
});
export default sql;