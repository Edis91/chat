import React, {useEffect, useContext } from 'react';

import './Shuffle.css';
import { GlobalContext } from '../../../GlobalContext';

const Shuffle = ({users, setShowHero, showHero, max, start}) => {

    const {startRound, socket, setStart} = useContext(GlobalContext);
    
    useEffect(()=>{
        // B - starting round 
        socket.on("start round", ()=> {
            //console.log("2-2-2")
            setStart(true)
        });

    },[]);


    function changeHeroes(action) {
        if(action === "chooseHero"){
            startRound();
        }
 
        else if(action === "next"){
            if (showHero === max){
                setShowHero(0)
            }
            else {
                setShowHero(showHero+1)
            }
        }

        else {
            if(showHero === 0){
                setShowHero(max);
            }
            
            else {
                setShowHero(showHero-1)
            }
        }
    }

    return (
        <div className="shuffle">
            <button className={start ? "hideButton" : "showButton"} disabled={start} onClick={()=> changeHeroes("prev")}>  previous hero </button>
            <button className={start ? "hideButton" : "showButton"} disabled={start || users.length<2} onClick={()=> changeHeroes("chooseHero") }> Choose hero </button>
            <button className={start ? "hideButton" : "showButton"} disabled={start} onClick={()=>changeHeroes("next")}> Next hero</button>
        </div>
    )
}

export default Shuffle;