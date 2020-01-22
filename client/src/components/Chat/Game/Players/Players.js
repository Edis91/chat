import React from 'react';

import './Players';

const Players = ({users}) => {
    return (
        <div className="players">
            {users && users.map(user=>{
                return  <div className="player" key={user.name}>
                            <h2> {user.name} </h2>
                            <p> Wins:0 Lives:2</p>
                        </div>
            })}
        </div>
    )
}

export default Players;