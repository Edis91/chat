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
        left:monsters,      // all monsters that are in the pile at the start of the round
        inDungeon:[],       // Monsters put into the dungeon so far
        inDungeonStart:[],  // Monsters at start of dungeon
        currentMonster:-1 , // -1 : none right now,  else: the monster
        givenUp:[],         //users index of those that gave up
        hp:0,
        equipment:["card1","card2","card3","card4","card5","card6","card7"],
        wait:0,    
        choose:""           // monster chosen for a card
    });

    // wait:  
    // here we CANNOT use cards
    // -1: waiting to make decision before enter dungeon  => 0
    // -2 : waiting to discard card => 0
    
    // here we CAN use cards
    // 0 : waiting to draw monster card (not showing monster)
    // 1 : monstercard drawn (show the monster) 
    // 2 : waiting to use after death => 0

    // used for starting new round
    const [start, setStart] = useState(false);

    //used for logging all events
    const [log, setLog] = useState([])

    function addToLog (add){
        if(add.delete){
            setLog([])
        }
        else{
            add.id =log.length
            setLog([...log, add])
        }
    }

    const startGame = ()=>{
        socket.emit("start game", room)
    }

    return (
        <GlobalContext.Provider 
        value={{
            socket,name, setName, room, setRoom,
            startGame, round, setRound, start, setStart, monsters,
            log,setLog, addToLog
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}