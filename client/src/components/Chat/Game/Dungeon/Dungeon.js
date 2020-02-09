import React, { useContext, useEffect, useState } from 'react';

import './Dungeon.css';
import { GlobalContext } from '../../../GlobalContext';

const {monsters} = require("../AllMonsters")

const Dungeon = ({users, heroes, showHero}) => {
    const {socket, room, round, setRound, start, setStart ,addToLog} = useContext(GlobalContext);

    const [beforeDungeon, setBeforeDungeon] = useState(true);

    const [reducedDamage, setReducedDamage] = useState(0)
    
    useEffect(()=>{
        // When only one player left this round, enter dungeon
        
        if(users.length - round.givenUp.length === 1){

            // Setting up before we enter dungeon (done once)
            if(beforeDungeon){
                let heroName = heroes[showHero].card1.text1;
                let specialCard = "";

                // heroes with any condition required before entering dungeon
                let heroSpecialCondition = ["Warrior", "Rogue", "Bard"] 
                for(let name of heroSpecialCondition){
                    if(heroName === name){
                        // see if any card in equipment that makes us choose before entering dungeon
                        for(let card of round.equipment){
                            if(heroes[showHero][card].conditions){
                                // first condition
                                let condition = heroes[showHero][card].conditions[0]
                                if(condition === "kill-choose"){
                                    specialCard = card;
                                    break;
                                }
                                else if(condition === "reduce-damage"){
                                    specialCard = card;
                                    break;
                                }   
                            }
                        }
                    }
                }
                
                if(specialCard){
                    let cardCondition1 = heroes[showHero][specialCard].conditions[0]
                    let cardCondition2 = heroes[showHero][specialCard].conditions[1]
                    
                    // if choise before entering dungeon
                    if(cardCondition1 === "kill-choose"){
                        setRound({...round, inDungeonStart:round.inDungeon, wait:-1, choose:specialCard})
                    }
                    
                    // if we have card that reduces damage
                    else if(cardCondition1 === "reduce-damage"){
                        if(cardCondition2 === "elvish-harp"){
                            setRound({...round, inDungeonStart:round.inDungeon, choose:"elvish-harp"})
                        }
                    }

                }
                else{
                    setRound({...round, inDungeonStart:round.inDungeon})
                }
                setBeforeDungeon(false)
            }

            //Check status of game (Win, lose, use special card, discard)
            getStatus()
            
            // sockets needed for one player
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
                triggerEquipment(data.action, data.discard, data.extra, data.extra2 ,data.card);
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

        else{
            // sockets needed for more player
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
                setRound({...round, currentMonster:monst, wait:1})
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
        
        // closes sockets as component re-renders
        return () => {
            socket.emit("disconnect")
            socket.off();
        }

    },[round, start])

    function getStatus(){
        // if card might have effect on next turn
        if(round.choose === "keepIfEven" && round.wait === 1){
            // if next monster not even, discard card 
            if(round.currentMonster.strength %2 === 1){
                
                let equipment = [...round.equipment];
                equipment = equipment.filter(item => item !== round.card)
                addToLog({msg:"Monster's strength is odd, " + heroes[showHero][round.card].text1 + " is discarded"})
                setRound({...round, choose:"", card:"", equipment:equipment})
            }
        }

        //  if hero died
        if(round.hp <1){
            let cardsAfterDeath = cardsWhenDead()
            // cards after death
            if(cardsAfterDeath.length !== 0 && round.wait !== 2){
                for(let card of cardsAfterDeath){
                    addToLog({msg: "Hero died but you can still use " + heroes[showHero][card].text1, type:"mystery"})
                }
                setRound({...round, wait:2})
            }
            // lost
            else if(round.wait !== 2 ){
                addToLog({msg:users[round.turn].name + " has lost this round", type:"giveUp"})
                users[round.turn].lives -= 1
                resetRound()
            }
        }

        // win
        else if((round.inDungeon.length === 0 && round.hp>0) || round.wait === 9){
            addToLog({msg:users[round.turn].name + " has won", type:"win"})
            users[round.turn].wins += 1
            resetRound();
        }
    }
    
    // set new round, player who entered dungeon gets to start and choose hero
    function resetRound(){
        setBeforeDungeon(true)  // resets first check when entering dungeon
        setStart(false)         // lets us choose hero again
        setReducedDamage(0)
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

    function triggerEquipment(action, discard, extra, extra2, card){
        let cardName = heroes[showHero][card].text1

        if(action==="kill"){
            let data = killMonster();

            let equipment = [...round.equipment];
            equipment = equipment.filter(item => item !== card)

            //discarding one card ( the used card)
            if(discard==="one"){
                
                addToLog({msg: round.currentMonster.name + " was killed with " + cardName ,type:"kill"})
                setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, equipment:equipment, wait:0})
            }
            //discarding two cards
            else if(discard==="two"){
                addToLog({msg: round.currentMonster.name + " was killed with " + cardName+ ". Player has to discard one more card",type:"kill"})
                setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, equipment:equipment, wait:-2})
            }

            //discarding next turn
            else if(discard==="next"){
                addToLog({msg: round.currentMonster.name + " was killed with " + cardName + ". Next monster can also be killed with this effect", type:"kill"})
                setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, wait:0, choose:"killNext"})
                
            }

            //don't discard
            else if(discard === "never"){
                if(extra && extra==="add"){
                    addToLog({msg:"killed " + round.currentMonster.name + " with " + cardName + " and increased hp with " + round.currentMonster.strength,type:"kill"})
                    setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, hp:round.hp + round.currentMonster.strength, wait:0})
                }
                else if(extra && extra==="choose now"){
                    if(round.choose==="" || round.choose===round.currentMonster.name){
                        if(round.choose===""){
                            addToLog({msg:"killed " + round.currentMonster.name + " with " + cardName +" and can be used again for same monster", type:"kill"})
                            setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, wait:0, choose:round.currentMonster.name})
                        }
                        else{
                            addToLog({msg:"killed " + round.currentMonster.name + " with " + cardName +" and can be used again for same monster", type:"kill"})
                            setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, wait:0})
                        }    
                    }
                }

                else if(extra && extra==="reduce"){
                    addToLog({msg:"Killed a " + round.currentMonster.name + " with " + cardName + " and reduced incoming damage by " + extra2, type:"mystery"})
                    setReducedDamage(reducedDamage + extra2)
                    setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, wait:0})
                }

                else{
                    addToLog({msg:"killed " + round.currentMonster.name + " with " + cardName, type:"kill"})
                    setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, wait:0})
                }
            }

            else if(discard==="maybe"){
                if(extra === "even"){
                    addToLog({msg:"killed " + round.currentMonster.name + " with " + cardName, type:"kill"})
                    setRound({...round, inDungeon:data.inDungeon, currentMonster:data.nextMonster, wait:0, choose:"keepIfEven", card:card})
                }
            }
        }

        else if(action==="resurrect"){
            addToLog({msg:"Resurrecting hero with " + cardName, type:"win"})
            let equipment = [...round.equipment];
            equipment = equipment.filter(item => item !== card)
            setRound({...round, hp:heroes[showHero].card1.hp, equipment:equipment, wait:0})
        }

        else if(action==="unique-monsters"){
            let win = duplicateInArray(round.inDungeonStart)

            if(win){
                setRound({...round, wait:9})
            }
        }

        else if(action === "switch"){
            // receiving monster index with extra
            let monst = round.left[extra]
            addToLog({msg:"used " + cardName + " and replaced " + round.currentMonster.name + " with "+ monst.name, type:"win"})

            let inDungeon2 = [...round.inDungeon]
            let index = inDungeon2.length-1
            inDungeon2[index] = monst;

            let inDungeonStart2 = [...round.inDungeonStart]
            inDungeonStart2[index] = monst

            setRound({...round, currentMonster:monst, inDungeon: inDungeon2, inDungeonStart: inDungeonStart2})
        }
    }

    function duplicateInArray(array){
        let valuesSoFar = [];
        for(let i=0; i < array.length; i++){
            let value = array[i].name;
            console.log(value)
            if(valuesSoFar.indexOf(value) !== -1){
                return false
            }
            valuesSoFar.push(value)
        }
        return true
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
        // set next monster
        let inDungeon = [...round.inDungeon]
        let monster = inDungeon.pop();
        
        let monsterDamage = monster.strength;

        if(round.choose === "elvish-harp" && round.hp < 5){
            if(monster.strength %2 === 0){
                monsterDamage = 2
            }
            else {
                monsterDamage = 1
            }
        }
        
        let damageTaken = monsterDamage - reducedDamage;
        if(damageTaken<0){
            damageTaken=0;
        }

        addToLog({msg:"Player takes a hit and loses " + damageTaken + " hp", type:"attackMe"})
        
        // if next monster exists
        if(inDungeon[inDungeon.length-1]){
            let nextMonster = inDungeon[inDungeon.length-1]
            setRound({...round, hp:round.hp - damageTaken, inDungeon:inDungeon, currentMonster:nextMonster, wait:0})   
        }
        else{
            setRound({...round, hp:round.hp - damageTaken, inDungeon:inDungeon, currentMonster:-1, wait:0})        
        }
    }
    

    
    // event listeners for the current player 
    useEffect(()=> {
        let amount = users.length - round.givenUp.length;

        if(users[round.turn].id === socket.id){
            function keyTrigger({key}){
                if(amount > 1){
                    if(round.wait === 0){
                        if(key === "t"){ takeMonsterCard()}
                        else if(key === "g"){giveUpRound()}
                    }
                    else if(round.wait === 1){
                        if(key === "a"){addToDungeon()}
                        // discard equipment here
                        else if(key === "1"){console.log("discard card 2")}
                        else if(key === "2"){console.log("discard card 3")}
                        else if(key === "3"){console.log("discard card 4")}
                        else if(key === "4"){console.log("discard card 5")}
                        else if(key === "5"){console.log("discard card 6")}
                        else if(key === "6"){console.log("discard card 7")}
                    }
                }

                else if(amount === 1){
                    if(round.wait === 0){
                        if(key === "d"){revealMonster()}
                    }
                    else if(round.wait === 1){
                        if(key === "s"){attackMe()}
                        else if(key === "1"){console.log("use card 2")}
                        else if(key === "2"){console.log("use card 3")}
                        else if(key === "3"){console.log("use card 4")}
                        else if(key === "4"){console.log("use card 5")}
                        else if(key === "5"){console.log("use card 6")}
                        else if(key === "6"){console.log("use card 7")}

                    }
                }

            }
            
            window.addEventListener("keyup", keyTrigger)
            return ()=>{ window.removeEventListener('keyup', keyTrigger) }
        }
        
        // event listeners for other players 
        else {

        }

        

    },[round]) 

    // socket emits
    
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

    function attackMe(){
        socket.emit("attack me", room)
    }

    function revealMonster(){
        socket.emit("reveal monster", room)
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
                            className={(users[round.turn].id === socket.id && round.currentMonster === -1) ? "choice" : "disabled"} 
                            disabled={users[round.turn].id !== socket.id || round.currentMonster !== -1} 
                            onClick={()=> takeMonsterCard()}> Take monster card <span className="key1">(T)</span>
                            
                        </button>
                        <button 
                            className={(users[round.turn].id === socket.id && round.currentMonster === -1) ? "choice" : "disabled"} 
                            disabled={users[round.turn].id !== socket.id || round.currentMonster !== -1} 
                            onClick={()=> giveUpRound()}> Give up round <span className="key2">(G)</span></button>
                        <button 
                            className={(users[round.turn].id === socket.id && round.currentMonster !== -1) ? "choice" : "disabled"} 
                            disabled={users[round.turn].id !== socket.id  || round.currentMonster === -1}
                            onClick={()=> addToDungeon()}> Add to dungeon <span className="key1">(A)</span>
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
                                onClick={()=> revealMonster()}
                                disabled={round.wait !== 0 || users[round.turn].id !== socket.id}
                                className={round.wait !== 0 ? "disabled":"choice"}
                            > 
                                Draw next monster <span className="key1">(D)</span>
                            </button>
                        }
                    
                    </div>

                    <div className="dungeonButtons">
                        <button 
                            className={(round.currentMonster !== -1 && round.wait===1) ? "choice" : "disabled"}
                            onClick={()=> attackMe()}
                            disabled={users[round.turn].id !== socket.id || round.wait !==1}
                            > Take a hit of ({round.currentMonster.strength - reducedDamage}) <span className="key1">(S)</span>
                        </button>
                    </div>                   
                </>
            }
            
        </div>
    )
}

export default Dungeon;