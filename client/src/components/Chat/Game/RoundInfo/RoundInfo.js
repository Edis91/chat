import React, { useContext } from 'react';
import { GlobalContext } from '../../../GlobalContext';

const RoundInfo = () => {

    const {round} = useContext(GlobalContext);

    return (
        <div className="roundInfo">
            <p> Monsters: {round.inDungeon.length} </p>
            <p> HP : {round.hp} </p>
        </div>
    )
}

export default RoundInfo;