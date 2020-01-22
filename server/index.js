const express = require("express");
const socketio =require("socket.io");
const http = require("http");

//Importing functions from users
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

io.on("connection", (socket)=>{
    socket.on("join", ({name, room}, callback)=>{
       
        // error returned if username is taken, otherwise user is returned
        const {error, user} = addUser({id: socket.id, name, room});

        if(error) { return callback(error)};

        //If no error, we join the room
        socket.join(user.room)

        //Send message to server that user joined a room
        socket.emit("message", { user:"admin", text: `${user.name}, welcome to the room ${user.room}`})

        //Send message to everyone in that room except myself
        socket.broadcast.to(user.room).emit("message", {user:"admin", text: `${user.name}, has joined`})
        
        // X-  when someone joins, send all users of that room to that room
        io.to(user.room).emit("get users", getUsersInRoom(user.room))

        console.log("user ' " + name + "  ' " + " has joined ' " + room + " ' ")
        console.log("People in this room are: ")
        console.log(getUsersInRoom(room).map(user => user.name))
        console.log("--------")

        callback();
    });

    //Receiving messages from frontEnd
    socket.on("sendMessage",(message, callback)=>{ 

        //get user that sent a message
        const user = getUser(socket.id);

        //send users messages to the room he is in
        io.to(user.room).emit("message", {user:user.name, text: message});

        callback()
    });

    // Getting all users in a room
    socket.on("get users", () => {
        
    });

    //A Starts game for everyone in one room
    socket.on("start game", (room)=> {
        console.log("Trying to start game on backend")
        io.to(room).emit("start game");
    })
 
    socket.on("disconnect", ()=>{
        const user = removeUser(socket.id);

        console.log("user ' " + user.name + " '" + " has left '" + user.room + " ' ")

        if(user){
            // inform the room who left
            io.to(user.room).emit("message", {user:"admin", text:`${user.name} has left`})

            // Y-  when someone leaves, update users in room
            io.to(user.room).emit("get users", getUsersInRoom(user.room))

            console.log("People in this room are: ")
            console.log(getUsersInRoom(user.room).map(user => user.name))
            console.log("--------")
        }
         
    });
})



server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`))