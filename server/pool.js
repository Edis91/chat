const {Pool} = require("pg");

//Connecting on localhost
let pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "chat",
    password: "root",
    port : 5432,
    max:20,
    connectionTimeoutMillis: 1000,
    idleTimeoutMillis: 1000
});

// Connecting on heroku
// const Pool = new Pool({
//     connectionString: process.env.MYDATABASE,
// })


module.exports = {pool};