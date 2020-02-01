import React, { useContext } from 'react';

import './Hero.css';
import { GlobalContext } from '../../../GlobalContext';

const Hero = ({users, heroes, showHero}) => {

    const {room, round, socket} = useContext(GlobalContext);

    const equipmentClass = (card) =>{
        let equipClass = "hero-card"

        if(card === "card1"){
            equipClass += " grid-1-2"
        }

        if(card === "card2"){
            equipClass += " grid-2-1"
        }

        if(!round.equipment.includes(card)){
            equipClass += " discarded"
        }

        if(round.currentMonster !== -1 && round.equipment.includes(card) && card !== "card1"){
            equipClass += " blinking"
        }
        return equipClass
    }

    function equipmentDiscard(card){
        if(users.length - round.givenUp.length !== 1){
            if(users[round.turn].id === socket.id && round.currentMonster !== -1){
                if(!round.equipment.includes(card) || card === "card1"){
                    console.log("card cannot be discarded")
                }
                else{
                    let nextPlayer = round.turn +1
                    socket.emit("discard", {room, card, nextPlayer})
                }
            }
        }
    }

    function equipmentUse(card){
        let conditions = heroes[showHero][card].conditions
        

        let data;
        

        switch (conditions[0]){
            case "kill-discard":
                data = killDiscard(conditions);
                break;
            case "kill-keep":
                data = killKeep(conditions);
                break;
            case "reduce-damage":
                data = reduceDamage(conditions);
                break;
            case "change-deck":
                data = changeDeck(conditions);
                break;
            case "win-condition":
                data = winCondition(conditions);
                break;
            case "resurrect":
                data = resurrect(conditions);
                break;
                        
            default:
                console.log("Condition does not exist")
                break;
            }   
            if(data){
                data.card = card;
                socket.emit("use equipment", {room, data})
            }
    }

    function killDiscard(conditions){
        let x = conditions[1];
        // name is the same
        if(x === round.currentMonster.name){
            if(conditions[2] && conditions[2]==="next"){
                console.log("You killed a " + conditions[1])
                console.log("You can kill next monster also")
            }
            else{
                console.log("You killed a " + conditions[1])
            }
        }

        // monsters strength is odd
        else if(x === "odd" && round.currentMonster.strength % 2 === 1){
            console.log("Killing monster with odd strength killed")
        }

        //kill any but discard one equipment card after
        else if(x === "any"){
            console.log("killing any monster")

            // check if we should discard one extra card
            if(conditions[2] && conditions[2] === "discard"){
                console.log("discard one extra card")
            }
        }

        else if(x==="repeat"){
            if(conditions[2] === "even" && round.currentMonster.strength %2 === 0){
                console.log("monsters strength is even and can be killed, repeat until next monsters strength is odd")
            }
        }

        else{
            console.log("card cannot be used here")
        }

    } 
    // action (what card does) 1.kill, 2.resurrect  3.choose
    //discard (when it should be discarded) 1. now , 2. never 3. condition
    // card (which card was triggered) card1,card2.. etc, used for disabling later

    function killKeep(conditions){
        let x = conditions[1]
        if(x === round.currentMonster.name){
            console.log("killing " + x + " and keeping card")
        }
        else if(x === "greater" && round.currentMonster.strength > conditions[2]){
            console.log("Monster has strength " + round.currentMonster.strength + " and can be killed - keeping card")
            return {action:"kill", discard:"never"}
        }

        else if(x==="less" && round.currentMonster.strength < conditions[2]){
            console.log("Monster has strength " + round.currentMonster.strength + " and can be killed - keeping card")
        }

        else if(x==="even" && round.currentMonster.strength %2 === 0){
            console.log("monsters strength was even and could be killed")
        }

        else if(x === "hp" && round.hp < conditions[2]){
            for(let strength of conditions[3]){
                if(strength === round.currentMonster.strength){
                    return console.log("This monster had strength "+ round.currentMonster.strength + " and could be defeated")
                }
            }

            return console.log("card cannot be used here")
        }

        else if(x==="add" && round.currentMonster.strength < conditions[2]){
            console.log("Monsters strength less than " + conditions[2] + " and hp was added")
        }

        else if(x==="reduce" && round.currentMonster.name === conditions[2]){
            console.log("Killed a " + conditions[2] + " and reduced incoming damage by " + conditions[3])
        }

        else{
            console.log("card cannot be used here")
        }

    }


    function reduceDamage(conditions){
        let x = conditions[1]
        console.log(x)    
    }

    function changeDeck(conditions){
        let x = conditions[1]
        console.log(x)    
    }

    function winCondition(conditions){
        let x = conditions[1]
        console.log(x)    
    }

    function resurrect(conditions){
        let x = conditions[1]
        console.log(x)    
    }

    return (
        <div className="hero">
            {heroes && Object.keys(heroes[showHero]).map(card => {
                return(
                    <div 
                        key={card} 
                        onClick={()=> (users.length - round.givenUp.length === 1) ? equipmentUse(card) : equipmentDiscard(card)}
                        className={equipmentClass(card)}
                    >
                        <h5> {heroes[showHero][card].text1} </h5>
                        <h5> {heroes[showHero][card].text2} </h5>
                    </div>
                )
            })}

        </div>
    )
}

export default Hero;