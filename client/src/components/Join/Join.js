import React,{useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'

import "./Join.css";
import { GlobalContext } from '../GlobalContext';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const {ENDPOINT} = useContext(GlobalContext)
    
    function registerUser(event){
        event.preventDefault();
        axios.post(ENDPOINT+"/user", {
            email:"admin@gmail.com",
            password: "admin"
        })
        .then(results => console.log(results))
        .catch(e => console.log(e))
    }

    return(
        <div className="JoinOuterContainer">
            <div className="JoinInnerContainer">
                <h1 className="heading"> Join </h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={(event)=> setName(event.target.value)} /></div>
                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event)=>setRoom(event.target.value)} /></div>
                <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                    <button className="button mt-20" type="submit"> Sign in</button>
                </Link>
                <button onClick={(event)=> registerUser(event)}> Register </button>
            </div>
        </div>
    )
}

export default Join;