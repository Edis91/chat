import React, { useEffect, useContext } from 'react';

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

        if(round.thrownEquipment.includes(card)){
            equipClass += " discarded"
        }
        return equipClass
    }

    function discardEquipment(card){
        if(users[round.turn].id === socket.id && round.currentMonster !== -1){
            if(round.thrownEquipment.includes(card) || card === "card1"){
                console.log("card cannot be discarded")
            }
            else{
                let nextPlayer = round.turn +1
                socket.emit("discard", {room, card, nextPlayer})
            }
        }
    }

    return (
        <div className="hero">
            {heroes && Object.keys(heroes[showHero]).map(card => {
                return(
                    <div 
                        key={card} 
                        className={equipmentClass(card)}
                        onClick={()=> discardEquipment(card)}
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