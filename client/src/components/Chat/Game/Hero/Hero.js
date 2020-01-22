import React from 'react';

import './Hero.css';

const Hero = ({heroes, showHero}) => {

    return (
        <div className="hero">
            <div className="card card1">
                <h5>{heroes[showHero].card1.text1}</h5>
                <h5>{heroes[showHero].card1.text2}</h5>
            </div>
            <div className="card card2">
                <h5>{heroes[showHero].card2.text1}</h5>
                <h5>{heroes[showHero].card2.text2}</h5>
            </div>
            <div className="card card3">
                <h5>{heroes[showHero].card3.text1}</h5>
                <h5>{heroes[showHero].card3.text2}</h5>
            </div>
            <div className="card card4">
                <h5>{heroes[showHero].card4.text1}</h5>
                <h5>{heroes[showHero].card4.text2}</h5>
            </div>
            <div className="card card5">
                <h5>{heroes[showHero].card5.text1}</h5>
                <h5>{heroes[showHero].card5.text2}</h5>
            </div>
            <div className="card card6">
                <h5>{heroes[showHero].card6.text1}</h5>
                <h5>{heroes[showHero].card6.text2}</h5>
            </div>
            <div className="card card7">
                <h5>{heroes[showHero].card7.text1}</h5>
                <h5>{heroes[showHero].card7.text2}</h5>
            </div>
        </div>
    )
}

export default Hero;