import React, {useEffect, useContext } from 'react';

import './Shuffle.css';
import { GlobalContext } from '../../../GlobalContext';

const Shuffle = ({users, setShowHero, showHero, max, start}) => {

    const {startRound, socket, setStart, room} = useContext(GlobalContext);
    
    useEffect(()=>{
        // B - starting round 
        socket.on("choose hero", (action)=> {
            //console.log("2-2-2")
            changeHeroes(action)
            
        });

        socket.on("start round", ()=>{
            console.log("7-7-7")
            setStart(true)
        })

        return ()=>{
            socket.emit("disconnect")
            socket.off()
        }

    },[showHero]);


    function changeHeroes(action) {
        if(action === "choose"){
            console.log("choose")
            startRound();
        }
 
        else if(action === "next"){
            console.log("next")
            if (showHero === max){
                setShowHero(0)
            }
            else {
                
                setShowHero(showHero+1)
            }
        }

        else {
            console.log("prev")
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
            <button className={start ? "hideButton" : "showButton"} disabled={start} onClick={()=> socket.emit("choose hero", {room, action:"prev"})}>  previous hero </button>
            <button className={start ? "hideButton" : "showButton"} disabled={start || users.length<2} onClick={()=> socket.emit("start round", room) }> Choose hero </button>
            <button className={start ? "hideButton" : "showButton"} disabled={start} onClick={()=>socket.emit("choose hero", {room, action:"next"})}> Next hero</button>
        </div>
    )
}

export default Shuffle;