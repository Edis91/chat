const express = require("express");

const router = express.Router();

const {addUser} = require("./controller/userRepo");

router.get("/", (req, res)=>{
    res.send("Server is up and running")
})

// Create user
router.route("/user").post(addUser)






module.exports = router;