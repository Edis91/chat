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
    
    console.log(req.body)
    //triggers .the, (results => ) in frontEnd
    callback();
})

app.use(router);

io.on("connection", (socket)=>{
    // Z - Trying to join room with a name
    socket.on("join", ({name, room})=>{
       
        // error returned if username is taken, otherwise user is returned
        const user = addUser({id: socket.id, name, room});

        //join room with user so that user
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

    // Y - Receiving messages 
    socket.on("sendMessage",(message, callback)=>{ 

        //get user that sent a message
        const user = getUser(socket.id);

        // X - Sending message to everyone in room
        io.to(user.room).emit("message", {user:user.name, text: message});
        callback()
    });

    //A Starts game for everyone in one room
    socket.on("start game", (room)=> {
        //console.log("1-1")
        io.to(room).emit("start game");
    })

    // B - starts a round in game
    socket.on("start round", (room)=>{
        console.log("7-7")
        io.to(room).emit("start round")
    })

    //H- switch turn
    socket.on("turn", (data)=>{
        //console.log("3-3")
        io.to(data.room).emit("turn", {nextPlayer:data.nextPlayer, monsterIndex:data.monsterIndex})
    });

    // add user who gave up to array
    socket.on("give up", (data)=>{
        console.log("4-4")
        io.to(data.room).emit("give up", {nextPlayer:data.nextPlayer, playerIndex:data.playerIndex})
    })

    socket.on("set monster", data =>{
        console.log("8-8")
        console.log("room is: " + data.room)
        console.log("index of card is: " + data.index)
        io.to(data.room).emit("set monster")
    })

    socket.on("choose hero", data =>{
        io.to(data.room).emit("choose hero", data.action)
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

// when its your turn
// 
// 
// If there are at least 2 pople left then give a choice. 
// 1. Take card 2. Give up round
// If give up round => make u unavailable to do anything until round completed
// If take card then show that monster to you and give u another choice
// 1. Put in dungeon  2. Remove one equipment card 

//What to do in order
//1. Fix giving up round
//2. Make last person enter dungeon  console.log("enter dungeon")
//3. 

// x. enter dungeon functionality