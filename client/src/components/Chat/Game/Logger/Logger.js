import React, { useState, useContext } from 'react';

import './Logger.css'
import { GlobalContext } from '../../../GlobalContext';

const Logger = () => {

    const {log} = useContext(GlobalContext);

    function getStyle(type){

        if(type==="giveUp"){
            return "#ce0f3d"
        }

        else if(type==="attackMe"){
            return "red"
        }

        else if(type==="win"){
            return "#a1dd70"
        }

    }

    return(
        <div className="logger">
            <h1>Game Log</h1>
            {log.map(l=>{
                return <div key={l.id} style={{color:getStyle(l.type)}} className={log.length-1 === l.id ? "logMessage blinking" : "logMessage"}> {l.msg} </div>
            })}
        </div>
    )
}

export default Logger;

// types enter addMonster giveUp  discard  attackMe  chooseHero