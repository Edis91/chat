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

        else{
            if(heroes[showHero].card1.text1 === "Ninja"){equipClass += " ninja"}
            else if(heroes[showHero].card1.text1 === "Bard"){equipClass += " bard"}
            else if(heroes[showHero].card1.text1 === "Warrior"){equipClass += " warrior"}
            else if(heroes[showHero].card1.text1 === "Mage"){equipClass += " mage"}
            else if(heroes[showHero].card1.text1 === "Barbarian"){equipClass += " barbarian"}
            else if(heroes[showHero].card1.text1 === "Rogue"){equipClass += " rogue"}
        }

        return equipClass
    }

    

    function equipmentUse(card){
        let conditions = heroes[showHero][card].conditions
        
        let data;

        switch (conditions[0]){
            case "kill-discard":
                if(round.wait === 1){
                    data = killDiscard(conditions);
                }
                break;
                
            case "kill-discard-maybe":
                if(round.wait === 1){
                    data = killDiscardMaybe(conditions)
                }
                break;

            case "kill-keep":
                if(round.wait === 1){
                    data = killKeep(conditions);
                }
                break;

            case "after-death":
                if(round.wait === 2){
                    data = afterDeath(conditions);
                }
                break;

            case "kill-choose":
                if(round.wait === 1){
                    data = killChoose(conditions)
                }
                break;

            case "switch-monster":
                if(round.wait === 1){
                    data = switchMonster()
                }
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

        // next monster can be killed due to card used on previous monster
        if(round.choose === "killNext"){
            return {action:"kill", discard:"one"}
        }
        
        // name is the same
        else if(x === round.currentMonster.name){
            // kill one more 
            if(conditions[2] && conditions[2]==="next"){
                return {action:"kill", discard:"next"}
            }
            // only kill one
            else{
                return {action:"kill", discard:"one"}
            }
        }

        // monsters strength is odd
        else if(x === "odd" && round.currentMonster.strength % 2 === 1){
            return {action:"kill", discard:"one"}
        }

        //kill any monster
        else if(x === "any"){
            //discard extra card
            if(conditions[2]==="discard"){
                return {action:"kill", discard:"two"}
            }
            else{
                return {action:"kill", discard:"one"}
            }
        }

    } 

    function killDiscardMaybe(conditions){
        let x = conditions[1];

        if(x==="repeat"){
            if(conditions[2] === "even" && round.currentMonster.strength %2 === 0){
                return {action:"kill", discard:"maybe", extra:"even"}
            }
        }
    }
    // action (what card does)                  1.kill, 2.resurrect  3.choose
    // discard (when it should be discarded)    1. one , 2. two 3. next turn, 4: never , 5:maybe
    // extra (anything more that applies)       1.next(also kills next monster) 2. repeat (repeat killing with same condition, then discard
    

    function killKeep(conditions){
        let x = conditions[1]
        
        if(x === round.currentMonster.name){
            return {action:"kill", discard:"never"}
        }
        else if(x === "greater" && round.currentMonster.strength > conditions[2]){
            return {action:"kill", discard:"never"}
        }

        else if(x==="less" && round.currentMonster.strength < conditions[2]){
            return {action:"kill", discard:"never"}
        }

        else if(x==="even" && round.currentMonster.strength %2 === 0){
            return {action:"kill", discard:"never"}
        }

        else if(x==="add"){
            if(round.currentMonster.strength<conditions[2]){
                //if strength less than 3, kill and add strength to heroes hp
                return {action:"kill", discard:"never", extra:"add"}
            }
        }

        else if(x === "hp" && round.hp < conditions[2]){
            for(let strength of conditions[3]){
                if(strength === round.currentMonster.strength){
                    return {action:"kill", discard:"never"}
                }
            }
        }

        else if(x==="reduce" && round.currentMonster.name === conditions[2]){
            return {action:"kill", discard:"never", extra:"reduce", extra2:1}
        }

    }

    function changeDeck(conditions){
        let x = conditions[1]
    }

    function afterDeath(conditions){
        let x = conditions[1]
        if(x==="resurrect"){
            return {action:"resurrect", discard:"one"}
        }

        else if(x==="unique-monsters"){
            return {action:"unique-monsters", discard:"one"}
        }
         
    }

    function killChoose(conditions){
        // Choose in dungeon
        if(conditions[2]==="after"){
            return {action:"kill", discard:"never", extra: "choose now"}
        }

        // Already chosen before entering dungeon
        else if(round.currentMonster.name === round.choose){
            return {action:"kill", discard:"never"}
        }
    }

    function switchMonster(){
        const monsterIndex = Math.floor(Math.random()*round.left.length)
        return {action:"switch", discard:"one", extra:monsterIndex}
    }

    function trigger(card){
        // if your turn
        if(socket.id === users[round.turn].id){
            if((users.length - round.givenUp.length === 1) && round.wait > -1 ){
                // if card has conditions (hp card do not)
                if(heroes[showHero][card].conditions){
                    // if card is still in play
                    if(round.equipment.includes(card)){
                        equipmentUse(card) 
                    }
                }
            }

            // discarding card only for draw phase ( if wait:1) 
            else{
                equipmentDiscard(card)
            }

        }
    }

    function equipmentDiscard(card){
        
        if(round.currentMonster !== -1 || round.wait < 0){
            if(!round.equipment.includes(card) || card === "card1"){
                console.log("card cannot be discarded")
            }
            else{
                let nextPlayer = round.turn
                if(round.wait === -2){
                    socket.emit("discard", {room, card, nextPlayer})
                }
                else{
                    nextPlayer += 1
                    socket.emit("discard", {room, card, nextPlayer})
                }
            }
        }
        
    }

    return (
        <div className="hero">
            {heroes && Object.keys(heroes[showHero]).map(card => {
                return(
                    <div key={card} onClick={()=> trigger(card)} className={equipmentClass(card)}>
                        <div className="card-top">
                            <img src={require(""+heroes[showHero][card].src)} alt="no icon"/> 
                        </div>
    
                        <div className="card-bot">
                            <div className="card-name">
                                <p> {heroes[showHero][card].text1} </p>           
                            </div>
                            <div className="card-text">
                                <p> {heroes[showHero][card].text2} </p>
                            </div>
                        </div>
                    
                    </div>
                )
            })}
        </div>
    )
}

export default Hero;

// Left to do
// make player have to draw next card so that choose effects can work
// discard 2 cards has to work.
// reduce incoming damage cards, show how much damage reduction is active
// switch monster to random in pile left
// Fix win-condition if all monster cards are unique ( EXTRA HARD)
// resurrect hero who has that card
// choose who to kill before entering dungeon card

// Change so that someone gets to choose hero, not all
// if someone wins or loses,
// => reset round to original, change (wins +1 or lives -1), make someone choose hero

// add events to buttons for easier play

// change vampire to count if player has 1 win