import React, { useContext } from 'react';
import { GlobalContext } from '../../../GlobalContext';

const RoundInfo = ({users}) => {

    const {round} = useContext(GlobalContext);

    return (
        <div className="roundInfo">
            <h4> Monsters in Dungeon: {round.inDungeon.length} </h4>
            <h4> Waiting for: {users[round.turn].name} </h4>
        </div>
    )
}

export default RoundInfo;