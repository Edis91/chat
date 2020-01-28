import React,{useState, useEffect} from 'react';
import queryString from 'query-string';
import './Chat.css';

import InfoBar from './InfoBar/InfoBar';
import Input from './Input/Input';
import Messages from './Messages/Messages';
import UsersInRoom from './UsersInRoom/UsersInRoom';
import Game from './Game/Game';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

const Chat = ({ location}) => {
    const {socket, setName, setRoom, setUserId} = useContext(GlobalContext)
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    //Used to switch from chat to start game
    const [start,setStart] = useState(false);

    // initial load to get name, room
    useEffect(()=>{
        const {name, room} = queryString.parse(location.search)

        setName(name);
        setRoom(room);
        

        // Z - Trying to join room with a name
        socket.emit("join", {name, room}, callBack =>{
            setUserId(socket.id)
        });

    },[])

    //Listening 
    useEffect(() => {
        
        socket.on("message", (message)=> {
            setMessages([...messages, message])
        });

        socket.on("get users", (users)=>{
            const tempUsers = users;
            for(let i=0; i<tempUsers.length; i++ ){
                tempUsers[i] = {...tempUsers[i], wins:0, lives:2, index:i}                
            }
            setUsers(tempUsers);
        });
        
        socket.on("start game", ()=> {
            setStart(true)
        })

        return () => {
            socket.emit("disconnect")
            socket.off();
        }

    },[messages]);


    //function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();
        if(message){
            // Y Sending message
            socket.emit("sendMessage", message, ()=>{ setMessage("")})
        }
    }


    
    return(
        <div className={start ? "game" : "chat"}>
            {!start &&
                <>
                    <InfoBar/>
                    <UsersInRoom users={users}/>
                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
                    <Messages messages={messages}/>
                </>
            }

            {start &&
                <Game users={users}/>
            }
             
        </div>
    )
}

export default Chat;