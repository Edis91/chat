import React, { useContext, useEffect, useState } from 'react';

import './Dungeon.css';
import { GlobalContext } from '../../../GlobalContext';

const Dungeon = ({users, heroes, showHero}) => {
    const {socket, room, round, setRound, name, start, addToLog} = useContext(GlobalContext);
    
    useEffect(()=>{
        
        // When only one player left this round, enter dungeon

        if(users.length - round.givenUp.length === 1){

            checkIfWon();
            checkIfLost();

            socket.on("use equipment", data =>{
                triggerEquipment(data.action, data.discard, data.card)
            })

        }

        else{
            socket.on("add monster", ()=>{
                addToLog({msg:users[round.turn].name + " placed monster in dungeon", type:"addMonster"})

                // find round.currentMonsters whose id does not match currentMonster
                let tempLeft = round.left.filter(item => item.id !== round.currentMonster.id)

                let nextPlayer = round.turn;
                if(tempLeft.length !== 0){
                    nextPlayer = findNextPlayer()
                    setRound({...round, inDungeon:[...round.inDungeon, round.currentMonster], left:tempLeft, turn:nextPlayer, currentMonster:-1})
                }
                else{
                    // Player who puts last monster card in dungeon has to enter the dungeon 
                    addToLog({msg:"Player " + users[nextPlayer] + " enters dungeon", type:"enter"})

                    let givenUp = []
                    for(let index in users){
                        let parsedIndex = parseInt(index)
                        if(parsedIndex !== round.turn){
                            givenUp.push(parsedIndex)
                        }
                    }
                    setRound({...round, inDungeon:[...round.inDungeon, round.currentMonster], left:tempLeft, turn:nextPlayer, givenUp:givenUp})
                }
            });
    
            //giving up
            socket.on(("give up"), ()=>{         
                addToLog({msg:users[round.turn].name + " gave up on this round", type:"giveUp"})      

                // Finding nextplayer 
                let nextPlayer = findNextPlayer();

                // Check if we enter dungeon and show last picked monster, adding player to givenUp, putting next player
                if(users.length - round.givenUp.length === 2){
                    setRound({...round, givenUp:[...round.givenUp, round.turn], turn:nextPlayer, currentMonster:round.inDungeon[round.inDungeon.length-1]})
                }
                else{
                    setRound({...round, givenUp:[...round.givenUp, round.turn], turn:nextPlayer})                
                }
            });
    
            socket.on("set monster", (monst) =>{
                addToLog({msg:users[round.turn].name + " took a monster card", type:"setMonster"})
                setRound({...round, currentMonster:monst})
            });

            socket.on("discard", (data) =>{
                addToLog({msg:users[round.turn].name + " discarded : " + heroes[showHero][data.card].text1, type:"discard"})
                  
                let tempLeft = round.left.filter(item => item.id !== round.currentMonster.id)
                let nextPlayer = findNextPlayer();

                // remove equipment card that was discarded
                let equipment = round.equipment.filter(card => card !== data.card)
                setRound({...round, currentMonster:-1, equipment:equipment, turn:nextPlayer, left:tempLeft})
            });
        }

        
        return () => {
            socket.emit("disconnect")
            socket.off();
        }

    },[round, start])

    function checkIfWon(){
        if(round.inDungeon.length === 0){
            addToLog({msg:users[round.turn].name + " has won", type:"win"})
            console.log("You Won")
        }
    }

    function checkIfLost(){
        if(round.hp <1){
            console.log("You lost")
        }
    }

    function triggerEquipment(action, discard, card){
        if(action==="kill"){
            console.log("kill monster")
            let data = killMonster();
            if(discard==="now"){
                let equipment = [...round.equipment];
                equipment = equipment.filter(item => item !== card)
                setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, equipment:equipment})
            }
            else if(discard === "never"){
                setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster})
            }
        }

        else if(action==="resurrect"){
            
        }
    }

    function killMonster(){
        let inDungeon = [...round.inDungeon]
        inDungeon.pop();
        let nextMonster = -1;

        // if next monster exists
        if(inDungeon[inDungeon.length-1]){
            nextMonster = inDungeon[inDungeon.length-1]
        }
        
        return {inDungeon:inDungeon, nextMonster:nextMonster}        
    }

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

    function findNextPlayer(){
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

    function monsterAttackMe(){
        addToLog({msg:"Player takes a hit: " + round.currentMonster.strength, type:"attackMe"})     
        // set next monster
        let inDungeon = [...round.inDungeon]
        let monster = inDungeon.pop();

        // if next monster exists
        if(inDungeon[inDungeon.length-1]){
            let nextMonster = inDungeon[inDungeon.length-1]
            setRound({...round, hp:round.hp - monster.strength, inDungeon:inDungeon, currentMonster:nextMonster})   
        }
        else{
            setRound({...round, hp:round.hp - monster.strength, inDungeon:inDungeon, currentMonster:-1})        
        }
    }

    return (
        <div className="dungeon">
            {users && round && (users.length - round.givenUp.length !== 1) ? 
                <>
                    <div className="dungeonMonster">
                            {socket.id === users[round.turn].id ?
                                <>
                                    {round.currentMonster !== -1 &&
                                        <>
                                            <p> id: {round.currentMonster.id}  </p>
                                            <p> {round.currentMonster.name} </p>
                                            <p> strength: {round.currentMonster.strength} </p>
                                        </>
                                    }
                                </>
                                :
                                <>
                                    {round.currentMonster !== -1 && 
                                        <p> {users[round.turn].name} picked a monster card </p>
                                    }
                                </>
                            }

                    </div>

                    <div className="dungeonButtons">
                    
                        <button 
                            className={(users[round.turn].name === name && round.currentMonster === -1) ? "choice blinking" : "disabled"} 
                            disabled={users[round.turn].name !== name || round.currentMonster !== -1} 
                            onClick={()=> takeMonsterCard()}> Take a monster card
                        </button>
                        <button 
                            className={(users[round.turn].name === name && round.currentMonster === -1) ? "choice blinking" : "disabled"} 
                            disabled={users[round.turn].name !== name || round.currentMonster !== -1} 
                            onClick={()=> giveUpRound()}> Give up round</button>
                        <button 
                            className={(users[round.turn].name === name && round.currentMonster !== -1) ? "choice blinking" : "disabled"} 
                            disabled={users[round.turn].name !== name  || round.currentMonster === -1}
                            onClick={()=> addToDungeon()}> add monster to Dungeon 
                        </button>
                    </div>
                </>

                :

                <>
                    <div className="dungeonMonster">
                        {round.inDungeon.length > 0 ?
                            <>
                                <p> id: {round.currentMonster.id}  </p>
                                <p> {round.currentMonster.name} </p>
                                <p> strength: {round.currentMonster.strength} </p>

                            </>
                            :
                            <p> {users[round.turn].name} has won</p>
                        }
                    
                    </div>

                    <div className="dungeonButtons">
                        <button 
                            className={"choice blinking"} 
                            onClick={()=> monsterAttackMe()}
                            disabled={users[round.turn].id !== socket.id}
                            > Take a hit
                        </button>
                    </div>                   
                </>
            }
            
        </div>
    )
}

export default Dungeon;