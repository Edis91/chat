import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: {user, text}, name }) => {
    let isSentByCurrentUser = false;
    
    const trimmedName = name.trim().toLowerCase();

    if(user === trimmedName){
        isSentByCurrentUser = true
    }

    return (
        isSentByCurrentUser 
        ? (
            <div className="message-1 message">
                <div className="name name-1">
                    <p > {trimmedName}</p>
                </div>
                <div className="text text-1">
                    <p > {ReactEmoji.emojify(text)} </p>
                </div>
            </div>
        )

        : (
            <div className="message-2 message">
                <div className="name name-2">
                    <p style={{color : user === "admin" ? "gold" : ""}}> {user}</p>
                </div>
                <div className=" text text-2">
                    <p > {ReactEmoji.emojify(text)} </p>
                </div>
            </div>           
        )
    )
}

export default Message;