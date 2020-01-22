import React from 'react';

import './UsersInRoom.css';

const UsersInRoom = ({users, name, startGame}) => {

    return (
        <div className="usersInRoom">
            {users && users.map(user=>{
                return (
                    <div key={user.name} className="user"> 
                        <h3 className="username"> {user.name} </h3> 
                    </div>
                )       
            })}
            {true && 
                <button onClick={()=> startGame()} className="start"> Start Game</button>
            }
        </div>
    )
}

export default UsersInRoom;