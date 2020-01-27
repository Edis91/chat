import React, {useState, createContext} from 'react';

import io from 'socket.io-client';
const ENDPOINT = "localhost:5000";
let socket = io(ENDPOINT);

export const GlobalContext = createContext();
GlobalContext.displayName = "GlobalContext";

export const Global = props => {
    
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const {monsters} = require('./Chat/Game/AllMonsters');

    // Keeps track of everything in a round (turn, monsters left, monsters in dungeon, which players have not given up)
    const [round, setRound] = useState({
        turn:0, left:monsters, inDungeon:[], givenUp:[]
    })

    // used for starting new round
    const [start, setStart] = useState(false);


    const startGame = ()=>{
        //console.log("1");
        // G - Starting Game
        socket.emit("start game", room)
    }

    // B - Starting round
    function startRound(){
        //console.log("2")
        socket.emit("start round", (room))
    }


    return (
        <GlobalContext.Provider 
        value={{
            socket,name, setName, room, setRoom, startGame, startRound,
            round, setRound, start, setStart
        }}>

            {props.children}
        </GlobalContext.Provider>
    )
}