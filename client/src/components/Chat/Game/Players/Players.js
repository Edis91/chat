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
                            <h2> {user.name} </h2>
                            <p> Lives: {user.lives} Wins: {user.wins}</p>
                            <button onClick={()=> console.log(round.givenUp)}> LOG Round </button>
                            <button onClick={()=> console.log(user.index)}> LOG PlayerId</button>
                        </div>
            })}
        </div>
    )
}

export default Players;

// className={user.name === name ? "player-me" : "player-enemy"}

// return (
//     <div className="players">
//         {users && users.map(user=>{
//             return  <div 
//                         key={user.name} 
//                         style={user.name === name ? styleMe : styleEnemy} 
//                         className={"player " + users[round.turn].name === user.name ? "blinking" : ""} 
//                     >
//                         <h2> {user.name} </h2>
//                         <p> Lives: {user.lives} Wins: {user.wins}</p>
//                     </div>
//         })}
//     </div>
// )