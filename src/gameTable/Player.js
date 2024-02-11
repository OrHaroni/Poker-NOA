// Player.js

import React from 'react';
import Card from './Card';
import RandomCard from './RandomCard';

const Player = ({ name}) => {
    return (
        <div className="player">
            <span className="player-name">{name}</span>
            <div className="player-cards">
                {/* Render one random Card component */}
                <RandomCard />
                <RandomCard />
            </div>
        </div>
    );
};

export default Player;
