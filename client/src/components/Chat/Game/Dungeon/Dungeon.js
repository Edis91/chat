import React, { useContext, useEffect, useState } from 'react';

import './Dungeon.css';
import { GlobalContext } from '../../../GlobalContext';

const Dungeon = ({users}) => {
    const {socket, room, round, setRound, name, start} = useContext(GlobalContext);
    const [enterDungeon, setEnterDungeon] = useState(false)
    
    useEffect(()=>{
        console.log(round.inDungeon)
        
        // When only one player left this round, enter dungeon
        if(users.length - round.givenUp.length === 1){
            setEnterDungeon(true)
        }

        else{
            socket.on("add monster", ()=>{
                // find round.currentMonsters whose id does not match currentMonster
                let tempLeft = round.left.filter(item => item.id !== round.currentMonster.id)

                let nextPlayer = round.turn;
                if(tempLeft.length !== 0){
                    nextPlayer = findNextPlayer()
                    setRound({...round, inDungeon:[...round.inDungeon, round.currentMonster], left:tempLeft, turn:nextPlayer, currentMonster:-1})
                }
                else{
                    // Player who puts last monster card in dungeon has to enter the dungeon 
                    let givenUp = []
                    for(let index in users){
                        let parsedIndex = parseInt(index)
                        if(parsedIndex !== round.turn){
                            givenUp.push(parsedIndex)
                        }
                    }
                    console.log(givenUp)
                    setRound({...round, inDungeon:[...round.inDungeon, round.currentMonster], left:tempLeft, turn:nextPlayer, currentMonster:-1, givenUp:givenUp})
                }
            });
    
            //giving up
            socket.on(("give up"), ()=>{               
                console.log("giving up") 
                // Finding nextplayer 
                let nextPlayer = findNextPlayer();
                
                // adding player to users who gave up on this round and putting next player
                setRound({...round, givenUp:[...round.givenUp, round.turn], turn:nextPlayer})
            });
    
            socket.on("set monster", (monst) =>{
                setRound({...round, currentMonster:monst})
            });

            socket.on("discard", (data) =>{
                let tempLeft = round.left.filter(item => item.id !== round.currentMonster.id)
                let nextPlayer = findNextPlayer(data.nextPlayer);
                setRound({...round, currentMonster:-1, thrownEquipment:[...round.thrownEquipment, data.card], turn:nextPlayer, left:tempLeft})
            });
        }

        
        return () => {
            socket.emit("disconnect")
            socket.off();
        }

    },[round, start])

    useEffect(()=>{
        if(enterDungeon){
            let player = users[round.turn];
            let monstersInDungeon = round.inDungeon;
            console.log("Player entered dungeon: " + player.name)
            console.log(player)
            console.log(monstersInDungeon)
            
        }

    }, [enterDungeon])

    function takeMonsterCard(){
        const monsterIndex = Math.floor(Math.random()*round.left.length)
        let monst = round.left[monsterIndex]
        socket.emit("set monster", {room, monst})
    }

    function addToDungeon(){
        socket.emit("add monster", room);
    }

    function giveUpRound(){
        socket.emit("give up", (room))
    }

    function findNextPlayer(next){
        let nextPlayer = round.turn +1;
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


    return (
        <div className="dungeon">
            <div className="dungeonMonster">
                {!enterDungeon && round.currentMonster !== -1 && 
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
                {enterDungeon && 
                    <>
                        <p> id: {round.currentMonster.id}  </p>
                        <p> {round.currentMonster.name} </p>
                        <p> strength: {round.currentMonster.strength} </p>
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