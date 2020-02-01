import React, { useContext } from 'react';
import { GlobalContext } from '../../../GlobalContext';

const RoundInfo = () => {

    const {round} = useContext(GlobalContext);

    return (
        <div className="roundInfo">
            <h4> Monsters in Dungeon: {round.inDungeon.length} </h4>
            <h4> HP : {round.hp} </h4>
        </div>
    )
}

export default RoundInfo;