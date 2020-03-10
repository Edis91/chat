import React, {useEffect, useContext } from 'react';

import './Shuffle.css';
import { GlobalContext } from '../../../GlobalContext';

const Shuffle = ({users, setShowHero, showHero, max, start, heroes}) => {

    const {socket, setStart, room, setRound, round, addToLog} = useContext(GlobalContext);
    
    useEffect(()=>{
        // B - starting round  
        socket.on("choose hero", (action)=> {
            changeHeroes(action)
        });
        
        socket.on("start round", ()=>{
            let hp = 0;
            
            Object.keys(heroes[showHero]).map(card => {
                let add = heroes[showHero][card].hp
                if(add){
                    hp += add
                }
            })

            setRound({...round, hp:hp})
            addToLog({msg:heroes[showHero].card1.text1 + " was chosen", type:"choose hero"})
            setStart(true)
        })

        return ()=>{
            socket.emit("disconnect")
            socket.off()
        }

    },[showHero]);


    function changeHeroes(action) {
        if(action === "next"){
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
            <button className={start ? "hideButton" : "showButton"} disabled={users.length < 2 || users[round.turn].id !== socket.id} onClick={()=> socket.emit("choose hero", {room, action:"prev"})}>  previous hero </button>
            <button className={start ? "hideButton" : "showButton"} disabled={users.length < 2 || users[round.turn].id !== socket.id} onClick={()=>socket.emit("choose hero", {room, action:"next"})}> Next hero</button>
            <button className={start ? "hideButton" : "showButton"} disabled={users.length < 2 || users[round.turn].id !== socket.id} onClick={()=> socket.emit("start round", room) }> Choose hero </button>
        </div>
    )
}

export default Shuffle;