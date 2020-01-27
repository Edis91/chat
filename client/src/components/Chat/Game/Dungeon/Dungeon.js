import React, { useContext, useState, useEffect } from 'react';

import './Dungeon.css';
import { GlobalContext } from '../../../GlobalContext';

const Dungeon = ({users}) => {

    const {socket, room, round, setRound, name, monsters, start} = useContext(GlobalContext);

    //Used for displaying what monster was picked
    const[monsterIndex, setMonsterIndex] = useState(-1)

    useEffect(()=>{
        //If one player left, that player enters dungeon
        if(users.length - round.givenUp.length === 1){
            enterDungeon(users[round.turn].index);
        }

        // If at least 2 players left
        else{
            socket.on("turn", (data)=>{
                //console.log("3-3-3")

                // setting monster in dungeon and removing monster from pool
                let temp = round.left.filter(monster => monster.id !== round.left[data.monsterIndex].id)

                let nextPlayer = data.nextPlayer;
                if(nextPlayer === users.length){
                    nextPlayer = 0;
                }
                
                let searchNextPlayer = true;
                
                while(searchNextPlayer){
                    if(round.givenUp.includes(nextPlayer)){
                        nextPlayer += 1
                    }
                    else {
                        searchNextPlayer = false
                    }
                }
                setRound({...round, inDungeon:[...round.inDungeon, round.left[data.monsterIndex]], left:temp, turn:nextPlayer})
                setMonsterIndex(-1)
                
            });

            //giving up
            socket.on("give up", (data)=>{
                console.log("4-4-4")
                
                // Finding nextplayer 
                let nextPlayer = data.nextPlayer;
                if(nextPlayer === users.length){
                    nextPlayer = 0;
                }
                
                let searchNextPlayer = true;
                
                while(searchNextPlayer){
                    if(round.givenUp.includes(nextPlayer)){
                        nextPlayer += 1
                    }
                    else {
                        searchNextPlayer = false
                    }
                }
                
                // adding player to users who gave up on this round and putting next player
                setRound({...round, givenUp:[...round.givenUp, data.playerIndex], turn:nextPlayer})
            })

            socket.on("set monster", (index) =>{
                console.log("8-8-8")
                setMonsterIndex(index)
            })
        }

        return () => {
            socket.emit("disconnect")
            socket.off();
        }

    },[round, monsterIndex])

    function takeMonsterCard(){
        // Taking random monster form what is left
        console.log("8")
        const index = Math.floor(Math.random()*round.left.length)
        console.log("index: " + index)
        socket.emit("set monster", {room, index})
        
    }

    function addToDungeon(){
        //Adding card to dungeon
        let nextPlayer = round.turn +1
        socket.emit("turn", {room, nextPlayer, monsterIndex});
    }

    function giveUpRound(){
        console.log("4")
        let nextPlayer = round.turn +1;
        socket.emit("give up", {room, nextPlayer, playerIndex: round.turn})
    }

    function enterDungeon(userIndex){
        console.log(users[userIndex].name +" enters Dungeon")
    }

    return (
        <div className="dungeon">
            <div className="dungeonMonster">
                {monsterIndex > -1 && 
                <>
                    {(users[round.turn].id === socket.id) ?
                            <>
                                <p> {monsters[monsterIndex].name} </p>
                                <p> strength: {monsters[monsterIndex].strength} </p>
                            </>
                            :
                            <>
                                <p> {users[round.turn].name} picked a monster card and is deciding what to do </p>
                            </>
                    }
                </>
                }
            </div>
            
            <div className="dungeonButtons">
                <button 
                    className={(users[round.turn].name === name && monsterIndex === -1) ? "choice " : "disabled"} 
                    disabled={users[round.turn].name !== name || monsterIndex !== -1} 
                    onClick={()=> takeMonsterCard()}> Take a Monster card
                </button>
                <button 
                    className={(users[round.turn].name === name && monsterIndex === -1) ? "choice " : "disabled"} 
                    disabled={users[round.turn].name !== name || monsterIndex !== -1} 
                    onClick={()=> giveUpRound()}> Give up round</button>
                <button 
                    className={(users[round.turn].name === name && monsterIndex > -1) ? "choice " : "disabled"} 
                    disabled={users[round.turn].name !== name || monsterIndex === -1}
                    onClick={()=> addToDungeon()}> add monster to Dungeon 
                </button>
                <button onClick={()=> console.log(monsterIndex)}> LOG MONSTERINDEX</button>
            </div>
            
        </div>
    )
}

export default Dungeon;