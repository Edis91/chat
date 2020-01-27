import React, { useContext, useState, useEffect } from 'react';

import './Dungeon.css';
import { GlobalContext } from '../../../GlobalContext';

const Dungeon = ({users}) => {

    const {socket, room, round, setRound, name} = useContext(GlobalContext);

    useEffect(()=>{

        // H . Switch turn
        socket.on("turn", (data)=>{
            //console.log("3-3-3")

            // setting monster in dungeon and removing monster from pool
            let temp = round.left.filter(monster => monster.id !== round.left[data.monsterIndex].id)

            //Check whose turn it is next
            let nextPlayer = data.nextPlayer;

            let playersLeft = users.length - round.givenUp.length;
            console.log("playersLeft: " +  playersLeft)

            if(data.nextPlayer !== users.length){
                setRound({...round, inDungeon:[...round.inDungeon, round.left[data.monsterIndex]], left:temp, turn:nextPlayer})
            }
            else{
                setRound({...round, inDungeon:[...round.inDungeon, round.left[data.monsterIndex]], left:temp, turn:0})
            }
            
        });

        socket.on("give up", (index)=>{
            //console.log("4-4-4")
            console.log(index)
            // adding player to users who gave up on this round
            setRound({...round, givenUp:[...round.givenUp, index]})
        })

    },[round])

    function addToDungeon(){
        // Taking random monster form what is left
        const monsterIndex = Math.floor(Math.random()*round.left.length)

        let nextPlayer = round.turn +1
        socket.emit("turn", {room, nextPlayer, monsterIndex});
        //console.log("3")
    }

    function giveUpRound(){
        //console.log("4")
        socket.emit("give up", {playerIndex:round.turn, room})
    }

    return (
        <div className="dungeon">
            
            <button className={users[round.turn].name ===name ? "choice " : "disabled"} disabled={users[round.turn].name !==name } onClick={()=> addToDungeon()}> Continue</button>
            
            <button className={users[round.turn].name ===name ? "choice " : "disabled"} disabled={users[round.turn].name !==name } onClick={()=> giveUpRound()}> Give up</button>
            
            <button onClick={()=>console.log(round)} > LOG</button>
        </div>
    )
}

export default Dungeon;