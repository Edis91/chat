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

const {heroes} = require('./AllHeroes');

const Game = ({users}) => {

    const {start} = useContext(GlobalContext)

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
        </>
    ) 
}

export default Game;