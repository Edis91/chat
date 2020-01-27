const {pool} = require("./pool");

function createAllTables(){
    //pool.query("DROP TABLE IF EXISTS users")
    pool.query("CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, email text, password text)")
}


// example
// pool.query("select * from people where id>0")
// .then(results => console.table(results.rows))
// .catch(e => console.log(e))

module.exports = {createAllTables};