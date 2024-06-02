import React, { useState } from 'react';
import RandomTwoCards from './RandomCard';
import './table.css';
import cards from '../assets/cards.png';

const Player = (props) => {
    
    return (
        <div className={props.className}>
            <span className="player-name">{props.name}</span>
            <div className="player-cards">
                    <img className="hidden-cards" src={cards} alt="Player Cards" />
            </div>
        </div>
    );
};

export default Player;
