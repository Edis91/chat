import React, { useContext } from 'react';

import './UsersInRoom.css';
import { GlobalContext } from '../../GlobalContext';

const UsersInRoom = ({users}) => {

    const {name, startGame} = useContext(GlobalContext)

    return (
        <div className="usersInRoom">
            {users && users.map(user=>{
                return (
                    <div key={user.name} className="user"> 
                        <h3 className="username"> {user.name} </h3> 
                    </div>
                )       
            })}
            {users && name && users[0] && //{&& users[0].name === name} &&
                <button onClick={()=> startGame()} className="start"> Start Game</button>
            }
        </div>
    )
}

export default UsersInRoom;