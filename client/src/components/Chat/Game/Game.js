import React, { useState, useContext } from 'react';

import Title from './Title/Title';
import Players from './Players/Players';
import Shuffle from './Shuffle/Shuffle';
import Hero from './Hero/Hero';
import RoundInfo from './RoundInfo/RoundInfo';
import Dungeon from './Dungeon/Dungeon';
import Logger from './Logger/Logger';
import './Game.css';

import { GlobalContext } from '../../GlobalContext';

const {monsterNames} = require("./AllMonsters")

const {heroes} = require('./AllHeroes');

const Game = ({users}) => {

    const {start, round, socket, room} = useContext(GlobalContext)

    //Counts the number of heroes that are part of the game
    const max = heroes.length-1;
    
    //Keeps track of what hero to show
    const [showHero, setShowHero] = useState(0);

    return (
        <>
            <Title/>
            <Players users={users}/>
            <Hero users={users} heroes={heroes} showHero={showHero}/>
            <Logger/>
            {start && <RoundInfo/>}
            {!start && <Shuffle heroes={heroes} users={users} start={start} max={max} showHero={showHero} setShowHero={setShowHero}/>}
            {start && <Dungeon showHero={showHero} heroes={heroes} users={users}/>}
            {round.wait === -1 && 
                <div className="choice">
                    <h5> Decision before entering dungeon</h5>
                    {heroes[showHero][round.choose].text1.includes("Vorpal") ? 
                        <>
                            <p> Choose which monster to kill</p>
                            
                            {monsterNames.map(monster => {
                                return <button className="choose" disabled={socket.id !== users[round.turn].id} key={monster} onClick={()=> socket.emit("choose monster", ({room, monster, card:round.choose}))}> {monster} </button>
                            })}
                        </>

                        :

                        <p> Choose nothing</p>
                    }
                    
                </div>
            }
            <button onClick={()=> console.log(round)}> Log</button>
        </>
    ) 
}

export default Game;