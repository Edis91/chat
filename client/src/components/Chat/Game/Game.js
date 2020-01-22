import React, { useState } from 'react';
import Title from './Title/Title';
import Players from './Players/Players';
import Shuffle from './Shuffle/Shuffle';
import Hero from './Hero/Hero';

import './Game.css';

const {heroes} = require('./AllHeroes');


const Game = ({users}) => {
    //Counts the number of heroes that are part of the game
    const max = heroes.length-1;
    
    //Keeps track of what hero to show
    const [showHero, setShowHero] = useState(0);

    return (
        <>
            <Title />
            <Players users={users}/>
            <Shuffle max={max} showHero={showHero} setShowHero={setShowHero}/>
            <Hero heroes={heroes} showHero={showHero}/>
        </>
    ) 
}

export default Game;