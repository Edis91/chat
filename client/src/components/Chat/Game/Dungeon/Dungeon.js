import React, { useContext, useEffect, useState } from 'react';

import './Dungeon.css';
import { GlobalContext } from '../../../GlobalContext';

const {monsters} = require("../AllMonsters")

const Dungeon = ({users, heroes, showHero}) => {
    const {socket, room, round, setRound, name, start, setStart ,addToLog} = useContext(GlobalContext);

    const [beforeDungeon, setBeforeDungeon] = useState(true);

    // wait:  
    // here we CANNOT use cards
    // -1: waiting to make decision before enter dungeon  => 0
    // -2 : waiting to discard card => 0
    
    // here we CAN use cards
    // 0 : waiting to draw monster card (not showing monster)
    // 1 : monstercard drawn (show the monster) 
    // 2 : waiting to use after death => 0 
    
    useEffect(()=>{
        
        // When only one player left this round, enter dungeon
        
        if(users.length - round.givenUp.length === 1){

            // Setting up before we enter dungeon (done once)
            if(beforeDungeon){
                let heroName = heroes[showHero].card1.text1;
                let specialCard = "";

                // heroes with any condition required before entering dungeon
                let heroSpecialCondition = ["Warrior", "Rogue"] 
                for(let name of heroSpecialCondition){
                    if(heroName === name){
                        // see if any card in equipment that makes us choose before entering dungeon
                        for(let card of round.equipment){
                            if(heroes[showHero][card].conditions && heroes[showHero][card].conditions[0] === "kill-choose"){
                                specialCard = card;
                                break;
                            }
                        }
                    }
                }
                
                if(specialCard){
                    setRound({...round, inDungeonStart:round.inDungeon, wait:-1, choose:specialCard})
                }
                else{
                    setRound({...round, inDungeonStart:round.inDungeon})
                }
                setBeforeDungeon(false)
            }

            //Check status of game ----------
            getStatus();

            if(round.wait === 2){
               console.log("waiting to use card after death")
            }

            else{
                socket.on("discard", (data) =>{
                    let equipment = round.equipment.filter(card => card !== data.card)
    
                    if(data.card === "card2" || data.card ==="card3"){
                        let cardHp = heroes[showHero][data.card].hp;
                        addToLog({msg:"Discarded " + heroes[showHero][data.card].text1 + " and lost " +cardHp +" hp", type:"discard"})
                        setRound({...round, equipment:equipment,hp:round.hp-cardHp ,wait:0})
                    }
                    else{
                        setRound({...round, equipment:equipment, wait:0})
                    }
                });
            
                socket.on("use equipment", data =>{
                    triggerEquipment(data.action, data.discard, data.extra ,data.card);
                })
    
                socket.on("attack me", ()=>{
                    monsterAttackMe();
                })

                socket.on("reveal monster", ()=>{
                    setRound({...round,wait:1})
                })

                socket.on("choose monster", ({monster, card}) =>{
                    addToLog({msg:"With card " + heroes[showHero][card].text1 + " player has chosen to kill "+ monster +"(s)", type:"mystery"})
                    setRound({...round, choose:monster, wait:0})
                })

            }
            
        }

        else{
            socket.on("add monster", ()=>{
                addToLog({msg:users[round.turn].name + " placed monster in dungeon", type:"addMonster"})

                // find round.currentMonsters whose id does not match currentMonster
                let tempLeft = round.left.filter(item => item.id !== round.currentMonster.id)

                let nextPlayer = round.turn;
                if(tempLeft.length !== 0){
                    nextPlayer = findNextPlayer()
                    setRound({...round, inDungeon:[...round.inDungeon, round.currentMonster], left:tempLeft, turn:nextPlayer, currentMonster:-1, wait:0})
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
                    setRound({...round, inDungeon:[...round.inDungeon, round.currentMonster], left:tempLeft, turn:nextPlayer, givenUp:givenUp, wait:0})
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
                setRound({...round, currentMonster:monst})
            });

            socket.on("discard", (data) =>{
                  
                let tempLeft = round.left.filter(item => item.id !== round.currentMonster.id)
                let nextPlayer = findNextPlayer();

                // remove equipment card that was discarded
                let equipment = round.equipment.filter(card => card !== data.card)

                if(data.card === "card2" || data.card ==="card3"){
                    let cardHp = heroes[showHero][data.card].hp;
                    addToLog({msg:"Discarded " + heroes[showHero][data.card].text1 + " and lost " +cardHp +" hp", type:"discard"})
                    setRound({...round, currentMonster:-1, equipment:equipment, turn:nextPlayer, left:tempLeft, hp:round.hp-cardHp, wait:0})
                }
                else{
                    addToLog({msg:"Discarded " + heroes[showHero][data.card].text1, type:"discard"})
                    setRound({...round, currentMonster:-1, equipment:equipment, turn:nextPlayer, left:tempLeft, wait:0})
                }
            });
        }
        
        return () => {
            socket.emit("disconnect")
            socket.off();
        }

    },[round, start])

    function getStatus(){
        //  if hero died
        if(round.hp <1){
            addToLog({msg:"Your hero died", type:"mystery"})
            let cardsAfterDeath = cardsWhenDead()
            // cards after death
            if(cardsAfterDeath.length !== 0 && round.wait !== 2){
                for(let card of cardsAfterDeath){
                    addToLog({msg: "Card left to use " + heroes[showHero][card].text1, type:"mystery"})
                }
                setRound({...round, wait:2})
            }
            // lost
            else{
                addToLog({msg:users[round.turn].name + " has lost", type:"giveUp"})
                users[round.turn].lives -= 1
                resetRound()
            }
        }

        // win
        else if(round.inDungeon.length === 0 && round.hp>0){
            addToLog({msg:users[round.turn].name + " has won", type:"win"})
            users[round.turn].wins += 1
            resetRound();
        }
    }
    
    // set new round, player who entered dungeon gets to start and choose hero
    function resetRound(){
        setBeforeDungeon(true)  // resets first check when entering dungeon
        setStart(false)         // lets us choose hero again
        setRound({              // reset round with new player starting
            turn:round.turn, left:monsters, inDungeon:[], inDungeonStart:[], currentMonster:-1 , givenUp:[],         
            hp:0, equipment:["card1","card2","card3","card4","card5","card6","card7"], wait:0, choose:""           
        })
    }

    // gets cards that can be used after death
    function cardsWhenDead(){
        let cardsCanUse =[]
        for(let card of round.equipment){
            if(heroes[showHero][card].conditions && heroes[showHero][card].conditions[0] === "after-death"){
                cardsCanUse.push(card);
            }
        }
        
        return cardsCanUse
    }

    function triggerEquipment(action, discard, extra, card){
        if(action==="kill"){
            let data = killMonster();

            let equipment = [...round.equipment];
            equipment = equipment.filter(item => item !== card)

            //discarding one card ( the used card)
            if(discard==="one"){
                
                addToLog({msg: round.currentMonster.name + " was killed with " + heroes[showHero][card].text1,type:"kill"})
                setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, equipment:equipment, wait:0})
            }
            //discarding two cards
            else if(discard==="two"){
                console.log("4")
                addToLog({msg: round.currentMonster.name + " was killed with " + heroes[showHero][card].text1+ ". Player has to discard one more card",type:"kill"})
                setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, equipment:equipment, wait:-2})
            }

            //discarding next turn
            else if(discard==="next"){

            }

            //don't discard
            else if(discard === "never"){
                console.log("1")
                if(extra && extra==="add"){
                    addToLog({msg:"killed " + round.currentMonster.name + " with " + heroes[showHero][card].text1 + " and increased hp with " + round.currentMonster.strength,type:"kill"})
                    setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, hp:round.hp + round.currentMonster.strength, wait:0})
                }
                else if(extra && extra==="choose now"){
                    if(round.choose==="" || round.choose===round.currentMonster.name){
                        console.log("2")
                        if(round.choose===""){
                            console.log("3")
                            addToLog({msg:"killed " + round.currentMonster.name + " with " + heroes[showHero][card].text1 +" and can be used again for same monster", type:"kill"})
                            setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, wait:0, choose:round.currentMonster.name})
                        }
                        else{
                            console.log("4")
                            addToLog({msg:"killed " + round.currentMonster.name + " with " + heroes[showHero][card].text1 +" and can be used again for same monster", type:"kill"})
                            setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, wait:0})
                        }    
                    }
                }
                else{
                    addToLog({msg:"killed " + round.currentMonster.name + " with " + heroes[showHero][card].text1, type:"kill"})
                    setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, wait:0})
                }
            }
        }

        else if(action==="resurrect"){
            addToLog({msg:"Resurrecting hero with " + heroes[showHero][card].text1, type:"win"})
            console.log(heroes[showHero].card1.hp)
            let equipment = [...round.equipment];
            equipment = equipment.filter(item => item !== card)
            setRound({...round, hp:heroes[showHero].card1.hp, equipment:equipment, wait:0})
        }

        else if(action==="choose"){

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
        socket.emit("give up", room)
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
        addToLog({msg:"Player takes a hit and loses " + round.currentMonster.strength + " hp", type:"attackMe"})     
        // set next monster
        let inDungeon = [...round.inDungeon]
        let monster = inDungeon.pop();

        // if next monster exists
        if(inDungeon[inDungeon.length-1]){
            let nextMonster = inDungeon[inDungeon.length-1]
            setRound({...round, hp:round.hp - monster.strength, inDungeon:inDungeon, currentMonster:nextMonster, wait:0})   
        }
        else{
            setRound({...round, hp:round.hp - monster.strength, inDungeon:inDungeon, currentMonster:-1, wait:0})        
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
                                            <img src={require(""+round.currentMonster.src)} alt=""/>
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
                            className={(users[round.turn].name === name && round.currentMonster === -1) ? "choice" : "disabled"} 
                            disabled={users[round.turn].name !== name || round.currentMonster !== -1} 
                            onClick={()=> takeMonsterCard()}> Take a monster card
                        </button>
                        <button 
                            className={(users[round.turn].name === name && round.currentMonster === -1) ? "choice" : "disabled"} 
                            disabled={users[round.turn].name !== name || round.currentMonster !== -1} 
                            onClick={()=> giveUpRound()}> Give up round</button>
                        <button 
                            className={(users[round.turn].name === name && round.currentMonster !== -1) ? "choice" : "disabled"} 
                            disabled={users[round.turn].name !== name  || round.currentMonster === -1}
                            onClick={()=> addToDungeon()}> add monster to Dungeon 
                        </button>
                    </div>
                </>

                :

                <>
                    <div className="dungeonMonster">
                        {round.inDungeon.length > 0 && round.wait===1?
                            <div>
                                <img src={require(""+round.currentMonster.src)} alt=""/>
                                <p> {round.currentMonster.name} </p>
                                <p> strength: {round.currentMonster.strength} </p>
                            </div>
                            :
                            <button 
                                onClick={()=> socket.emit("reveal monster", room)}
                                disabled={round.wait !== 0 || users[round.turn].id !== socket.id}
                                className={round.wait !== 0 ? "disabled":"choice"}
                            > 
                                Draw next monster 
                            </button>
                        }
                    
                    </div>

                    <div className="dungeonButtons">
                        <button 
                            className={(round.currentMonster !== -1 && round.wait===1) ? "choice" : "disabled"}
                            onClick={()=> socket.emit("attack me", room)}
                            disabled={users[round.turn].id !== socket.id || round.wait !==1}
                            > Take a hit
                        </button>
                    </div>                   
                </>
            }
            
        </div>
    )
}

export default Dungeon;