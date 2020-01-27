import io from 'socket.io-client';

const ENDPOINT = "localhost:5000";
let socket = io(ENDPOINT);

function joinRoom(){
    socket.emit("join", {name, room}, (error)=>{
        if(error){
            alert(error)
        }
    });
};

module.exports = joinRoom;