import React, { useContext } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

import './Messages.css';

import Message from './Message/Message';
import { GlobalContext } from '../../GlobalContext';

const Messages = ({ messages }) => {

    const {name} = useContext(GlobalContext)
    
    return(
        <ScrollToBottom className="all-messages">
            <div className="messages">
                {messages.map((message, i) => 
                    <div key={i}> <Message message={message} name={name}/> </div>) 
                }
            </div>
        </ScrollToBottom>
    )
}

export default Messages;
