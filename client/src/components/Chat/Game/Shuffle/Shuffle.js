import React from 'react';

import './Shuffle.css';

const Shuffle = ({setShowHero, showHero, max}) => {

    function changeHeroes(diff) {
        if(diff === 0){
            console.log(showHero)
        }
 
        else if(diff === 1){
            if (showHero === max){
                setShowHero(0)
            }
           
            else {
                setShowHero(showHero+1)
            }
        }

        else if(diff === -1){
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
            <button className="shuffle-left" onClick={()=> changeHeroes(-1)}> prev </button>
            <button className="shuffle-center" onClick={()=> changeHeroes(0) }> Choose </button>
            <button className="shuffle-right" onClick={()=>changeHeroes(1)}> Next </button>
        </div>
    )
}

export default Shuffle;

// Princess Ninja Bard
// [2, 0 , 1] => [1, 2, 0] => [0, 1, 2]
// [0, 1, 2]
// [1, 2, 0]
// ads