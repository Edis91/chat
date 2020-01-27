import React, { useContext } from 'react';

import closeIcon from '../../../icons/closeIcon.png';
import onlineIcon from '../../../icons/onlineIcon.png';

import './InfoBar.css';
import { GlobalContext } from '../../GlobalContext';

const InfoBar = () => {

    const {room} = useContext(GlobalContext)

    return(
        <div className="infoBar">
            <div className="onlineIcon">
                <img src={onlineIcon} alt="online"/>
            </div>
            <h1 className="room-name"> {room} </h1>
            <a href="/"> <img src={closeIcon} alt="close" /> </a>
            
        </div>

    )
}

export default InfoBar;