import React, { useState } from 'react';
import './table.css';
import cards from '../assets/cards.png';
import Timer from '../Animations/AnimatedTimer/Timer';
import logo from '../assets/logopng.png'

const Player = (props) => {
    
    return (
        <div className={props.className}>
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
