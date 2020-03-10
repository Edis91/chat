import React, { useContext } from 'react';

import './Logger.css'
import { GlobalContext } from '../../../GlobalContext';
import ScrollToBottom from 'react-scroll-to-bottom';

const Logger = () => {

    const {log, addToLog} = useContext(GlobalContext);

    function getStyle(type){

        if(type==="kill"){
            return "#61d4b3"
        }

        else if(type==="giveUp"){
            return "#ce0f3d"
        }

        else if(type==="attackMe"){
            return "red"
        }

        else if(type==="win"){
            return "#a1dd70"
        }

        else if(type==="mystery"){
            return "#be9fe1"
        }

        else if(type==="choose hero"){
            return "gold"
        }

        else{
            return '#bbe1fa'
        }

    }

    return(
        <ScrollToBottom className="logger">
            <div className="all-log">
                {log && log.map(l=>{
                    return <div key={l.id} style={{color:getStyle(l.type)}} className={log.length-1 === l.id ? "logMessage blinking" : "logMessage"}> {l.msg} </div>
                })}
            </div>
            <button className="reset-btn" onClick={()=> addToLog(-1)}> Reset log</button>
        </ScrollToBottom>
    )
}

export default Logger;

// types enter addMonster giveUp  discard  attackMe  chooseHero