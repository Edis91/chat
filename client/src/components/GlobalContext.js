import React, {useState, createContext} from 'react';

import io from 'socket.io-client';
const ENDPOINT = "localhost:5000";
let socket = io(ENDPOINT);

export const GlobalContext = createContext();
GlobalContext.displayName = "GlobalContext";

export const Global = props => {
    
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [userId, setUserId] = useState(-1)


    const {monsters} = require('./Chat/Game/AllMonsters');

    // Keeps track of everything in a round (turn, monsters left, monsters in dungeon, which players have not given up)
    const [round, setRound] = useState({
        turn:0, left:monsters, inDungeon:[],currentMonster:-1 ,givenUp:[], thrownEquipment:["card2"]
    });

    // used for starting new round
    const [start, setStart] = useState(false);


    const startGame = ()=>{
        socket.emit("start game", room)
    }

    return (
        <GlobalContext.Provider 
        value={{
            socket,name, setName, room, setRoom, userId, setUserId,
            startGame, round, setRound, start, setStart, monsters
        }}>

            {props.children}
        </GlobalContext.Provider>
    )
}