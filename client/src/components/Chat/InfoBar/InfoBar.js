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
            <p className="room-name"> {room} </p>
            <a href="/"> <img src={closeIcon} alt="close" /> </a>
            
        </div>

    )
}

export default InfoBar;