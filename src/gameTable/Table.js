// Table.js

import React from 'react';
import Player from './Player';
import './table.css'; // Import the table CSS file
import tableImg from './tableGame.png'; // Import the image
function Table() {
    return (
        <div className="table">
            <div>
                {/* Background image */}
                <img src={tableImg} alt="Poker Table" className="table-image" />
                {/* Players container */}
                <div className="players">
                    {/* Render Player components and apply CSS classes */}
                    <Player name="Player 1" className="player player1" />
                    <Player name="Player 2" className="player player2" />
                </div>
            </div>
        </div>
    );
}

export default Table;
