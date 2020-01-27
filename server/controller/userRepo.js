const {pool} = require("../pool");

function addUser(req, res){
    console.log(req.body)
    pool.query("INSERT INTO users (email, password) VALUES('edis@gmailcom', 'edis')")
    pool.query("INSERT INTO users (email, password) VALUES($1, $2)", [req.body.email, req.body.password])
    

    console.log(req.body.email)
    console.log(req.body.password)
    res.status(200)
}

module.exports = {addUser};