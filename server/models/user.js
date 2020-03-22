const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema and model

const UserSchema = new Schema({
    username:String,
    email: String,
    password:String
})

const User = mongoose.model("user", UserSchema)

module.exports = User