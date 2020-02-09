import io from 'socket.io-client';
import {useContext} from 'React'

import {GlobalContext} from '../GlobalContext'

function joinRoom(){
    const {ENDPOINT} = useContext(GlobalContext)
    let socket = io(ENDPOINT);
    
    socket.emit("join", {name, room}, (error)=>{
        if(error){
            alert(error)
        }
    });
};

module.exports = joinRoom;