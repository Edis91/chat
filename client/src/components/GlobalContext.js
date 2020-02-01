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
        turn:0, 
        left:monsters, 
        inDungeon:[], 
        currentMonster:-1 ,
        givenUp:[], 
        hp:0,
        equipment:["card1","card2","card3","card4","card5","card6"]
    });

    // used for starting new round
    const [start, setStart] = useState(false);

    //used for logging all events
    const [log, setLog] = useState([])

    function addToLog (msg){
        setLog([...log, {...msg, id:log.length}])
    }

    const startGame = ()=>{
        socket.emit("start game", room)
    }

    return (
        <GlobalContext.Provider 
        value={{
            socket,name, setName, room, setRoom,
            startGame, round, setRound, start, setStart, monsters,
            log, addToLog
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}