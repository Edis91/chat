import React, { useContext, useEffect } from 'react';

import './Dungeon.css';
import { GlobalContext } from '../../../GlobalContext';

const Dungeon = ({users}) => {

    const {socket, room, round, setRound, name, start} = useContext(GlobalContext);

    useEffect(()=>{
      
        // When only one player left this round, enter dungeon
        if(users.length - round.givenUp.length === 1){
            enterDungeon()
        }

        else{
            socket.on("add monster", (data)=>{
                // find round.currentMonsters whose id does not mathch data.round.currentMonster
                let tempLeft = round.left.filter(item => item.id !== round.currentMonster.id)

                let nextPlayer = findNextPlayer(data.nextPlayer)
    
                setRound({...round, inDungeon:[...round.inDungeon, round.currentMonster], left:tempLeft, turn:nextPlayer, currentMonster:-1})
                
            });
    
            //giving up
            socket.on("give up", (data)=>{                
                // Finding nextplayer 
                let nextPlayer = findNextPlayer(data.nextPlayer);
                
                // adding player to users who gave up on this round and putting next player
                setRound({...round, givenUp:[...round.givenUp, data.playerIndex], turn:nextPlayer})
            })
    
            socket.on("set monster", (monst) =>{
                setRound({...round, currentMonster:monst})
            });

            socket.on("discard", (data) =>{
                let tempLeft = round.left.filter(item => item.id !== round.currentMonster.id)
                let nextPlayer = findNextPlayer(data.nextPlayer);
                setRound({...round, currentMonster:-1,thrownEquipment:[...round.thrownEquipment, data.card], turn:nextPlayer, left:tempLeft})
            })
        }

        
        return () => {
            socket.emit("disconnect")
            socket.off();
        }

    },[round, start])

    function takeMonsterCard(){
        const monsterIndex = Math.floor(Math.random()*round.left.length)
        let monst = round.left[monsterIndex]
        socket.emit("set monster", {room, monst})
    }

    function addToDungeon(){
        let nextPlayer = round.turn +1
        socket.emit("add monster", {room, nextPlayer});
    }

    function giveUpRound(){
        let nextPlayer = round.turn +1;
        socket.emit("give up", {room, nextPlayer, playerIndex: round.turn})
    }

    function findNextPlayer(next){
        let nextPlayer = next;
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

            return nextPlayer
    }

    function enterDungeon(){
        console.log(users[round.turn].name +" enters Dungeon")
    }

    return (
        <div className="dungeon">
            <div className="dungeonMonster">
                {round.currentMonster !== -1 && 
                <>
                    {(users[round.turn].id === socket.id) ?
                            <>  
                                <p> id: {round.currentMonster.id}  </p>
                                <p> {round.currentMonster.name} </p>
                                <p> strength: {round.currentMonster.strength} </p>
                            </>
                            :
                            <>
                                <p> {users[round.turn].name} picked a monster card </p>
                            </>
                    }
                </>
                }
            </div>
            
            <div className="dungeonButtons">
                <button 
                    className={(users[round.turn].name === name && round.currentMonster === -1) ? "choice " : "disabled"} 
                    disabled={users[round.turn].name !== name || round.currentMonster !== -1} 
                    onClick={()=> takeMonsterCard()}> Take a monster card
                </button>
                <button 
                    className={(users[round.turn].name === name && round.currentMonster === -1) ? "choice " : "disabled"} 
                    disabled={users[round.turn].name !== name || round.currentMonster !== -1} 
                    onClick={()=> giveUpRound()}> Give up round</button>
                <button 
                    className={(users[round.turn].name === name && round.currentMonster !== -1) ? "choice " : "disabled"} 
                    disabled={users[round.turn].name !== name  || round.currentMonster === -1}
                    onClick={()=> addToDungeon()}> add monster to Dungeon 
                </button>
            </div>
        </div>
    )
}

export default Dungeon;