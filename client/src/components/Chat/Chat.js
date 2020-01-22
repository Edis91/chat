import React,{useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';

import InfoBar from './InfoBar/InfoBar';
import Input from './Input/Input';
import Messages from './Messages/Messages';
import UsersInRoom from './UsersInRoom/UsersInRoom';
import Game from './Game/Game';

let socket;

const Chat = ({ location}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const ENDPOINT = "localhost:5000";

    //Used to switch from chat to start game
    const [start,setStart] = useState(true);

    // initial load to get name, room
    useEffect(()=>{
        const {name, room} = queryString.parse(location.search)

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        //Trying to join room with a name
        socket.emit("join", {name, room}, (error)=>{
            if(error){
                alert(error)
            }
        });

    },[ENDPOINT, location.search])

    //Listening 
    useEffect(() => {
        socket.on("message", (message)=> {
            setMessages([...messages, message])
        });

        // X - when someone joins, we set that user to everyone
        socket.on("get users", (users)=>{
            setUsers(users);
        });
        
        // A - When game is started, we start it here
        socket.on("start game", ()=> {
            console.log("started game success")
            setStart(true)
        })

        return ()=>{
            socket.emit("disconnect");

            socket.off();
        }
    },[messages]);



    //function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();
        if(message){
            socket.emit("sendMessage", message, ()=>{ setMessage("")})
        }
    }

    // A - function for starting game
    const startGame = ()=>{
        console.log("Trying to start game on frontEnd");
        socket.emit("start game", room)
    }

    
    return(
        <div className={start ? "game" : "chat"}>
            {!start &&
                <>
                    <InfoBar room={room}/>
                    <UsersInRoom name={name} users={users} startGame={startGame}/>
                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
                    <Messages name={name} messages={messages}/>
                </>
            }

            {start &&
                <Game users={users}/>
            }
        </div>
    )
}

export default Chat;