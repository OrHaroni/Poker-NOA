// Player.js

import React from 'react';
import Card from './Card';
import RandomCard from './RandomCard';
import './table.css';
import cards from '../assets/cards.png';

const Player = ({ name}) => {
    return (
        <div className="player">
            <span className="player-name">{name}</span>
            <div className="player-cards">
                <img src={cards} />
                <RandomCard />
                <RandomCard />
            </div>
        </div>
    );
};

export default Player;
