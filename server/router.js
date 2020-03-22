const express = require("express");

const router = express.Router();

router.get("/", (req, res)=>{
    res.status(200).send("Server is up and running")
})

router.get("/hell", (req, res)=>{
    res.status(200).send("wtf")
})

// Creating new user
router.post("/user",(req, res) => {
    console.log("Creating new user")
    res.send("Success")
})


module.exports = router;