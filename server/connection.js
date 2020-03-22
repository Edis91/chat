const mongoose = require("mongoose");

// Connect to mongoDB
mongoose.connect("mongodb://localhost/game",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.once("open", function(){
    console.log("connection has been made, now make fireworks")
}).on("error", function(error){
    console.log("connection error: " + error)
});