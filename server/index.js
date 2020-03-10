const express = require("express");
const socketio =require("socket.io");
const http = require("http");

// Creating all tables needed
const {createAllTables} = require("./createTables")
createAllTables();

require("dotenv").config();

//Importing functions from users
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// accept headers and cors
app.use(express.json({limit:"10mb", extended:true}))
app.use((req, res, callback)=> {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    //triggers .the, (results => ) in frontEnd
    callback();
})

app.use(router);

io.on("connection", (socket)=>{
    // Z - Trying to join room with a name
    socket.on("join", ({name, room})=>{
       
        const user = addUser({id: socket.id, name, room});

        //join room with user
        socket.join(user.room)

        //Send message to server that user joined a room
        socket.emit("message", { user:"admin", text: `${user.name}, welcome to the room ${user.room}`})

        //Send message to everyone in that room except myself
        socket.broadcast.to(user.room).emit("message", {user:"admin", text: `${user.name}, has joined`})
        
        // X-  when someone joins, send all users of that room to that room
        io.to(user.room).emit("get users", getUsersInRoom(user.room))
        console.log("People in room: " +room)
        console.log(getUsersInRoom(room).map(user => user.name))
        console.log("--------")
        
    });

    socket.on("sendMessage",(message, callback)=>{ 

        //get user that sent a message
        const user = getUser(socket.id);

        // X - Sending message to everyone in room
        io.to(user.room).emit("message", {user:user.name, text: message});
        callback()
    });

    socket.on("start game", (room)=> {
        io.to(room).emit("start game");
    })

    socket.on("start round", (room)=>{
        io.to(room).emit("start round")
    })

    socket.on("add monster", (room)=>{
        io.to(room).emit("add monster")
    });

    socket.on("give up", (room)=>{
        io.to(room).emit("give up")
    })

    socket.on("set monster", ({room, monst}) =>{
        io.to(room).emit("set monster", monst)
        
    })

    socket.on("discard", ({room, card, nextPlayer})=>{
        io.to(room).emit("discard", {card, nextPlayer})
    })

    socket.on("choose hero", data =>{
        io.to(data.room).emit("choose hero", data.action)
    })

    socket.on("use equipment", ({room, data})=>{
        io.to(room).emit("use equipment", data)
    })

    socket.on("attack me", (room)=>{
        io.to(room).emit("attack me")
    })

    socket.on("reveal monster", (room)=>{
        io.to(room).emit("reveal monster")
    })

    socket.on("choose monster", ({room, monster, card})=>{
        io.to(room).emit("choose monster", ({monster, card}))
    })

    socket.on("disconnect", ()=>{
        const user = removeUser(socket.id);
        if(user){
            // inform the room who left
            io.to(user.room).emit("message", {user:"admin", text:`${user.name} has left`})

            // Y-  when someone leaves, update users in room
            io.to(user.room).emit("get users", getUsersInRoom(user.room))

            console.log("People in room: " + user.room)
            console.log(getUsersInRoom(user.room).map(user => user.name))
            console.log("--------")
        }
          
    });
})

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`))