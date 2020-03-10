import React, { useContext } from 'react';

import './Players.css';
import { GlobalContext } from '../../../GlobalContext';

const Players = ({users}) => {

    const {round, name} = useContext(GlobalContext);

    function classNames(player){
        let classes = "player";

        //if player has given up
        if(round.givenUp.includes(player.index)){
            classes += " givenUp"
        }
        //playerMe
        if(player.name === name){
            classes += " playerMe"
        }
        //playerEnemy
        else{
            classes += " playerEnemy"
        }
        //players turn
        if(users[round.turn].id === player.id){
            classes += " blinking"
        }
        // console.log(classes)
        return classes
    }

    return (
        <div className="players">
            {users && users.map(user=>{
                return  <div 
                            key={user.name} 
                            className={classNames(user)}
                        >
                            <p> {user.name} </p>
                            <p> Lives: {user.lives} Wins: {user.wins}</p>
                        </div>
            })}
        </div>
    )
}

export default Players;