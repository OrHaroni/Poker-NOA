import React, { useState } from 'react';
import './table.css';
import cards from '../assets/cards.png';
import Timer from '../Animations/AnimatedTimer/Timer';
import logo from '../assets/logopng.png'
import genericPic from '../assets/generic_profile_pic.jpg'
import aiPic from '../assets/gemini_profile_pic.jpeg'

const Player = (props) => {

    const profilePic = props.ai ? aiPic : genericPic
    
    return (
        <div className={props.className}>
            <img className='profile-pic' src={profilePic}/>
            {props.timer ? <Timer time={20}/> : null}
            <span className="player-name">{props.name}</span><br/>
            <img src={logo} alt="Logo" className="money-logo" />{props.money}$
            {props.cards == [] ?
            null :
            <div className="player-cards">
                    <img className="hidden-cards" src={cards} alt="Player Cards" />
            </div>}
        </div>
    );
};

export default Player;
