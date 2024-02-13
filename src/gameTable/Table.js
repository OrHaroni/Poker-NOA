// Table.js

import React from 'react';
import Player from './Player';
import './table.css'; // Import the table CSS file
import tableImg from '../assets/emptyTable.png'; // Import the image
function Table() {
    return (<>
    <button className='exit-button'>Back</button>
        <div className="table">
            <div>
                {/* Background image */}
                <img src={tableImg} alt="Poker Table" className="table-image" />
                {/* Players container */}
                <div className="players">
                    {/* Render Player components and apply CSS classes */}
                    <Player name="Player 1" className="player player1" />
                    <Player name="Player 2" className="player player2" />
                    <Player name="Player 3" className="player player3" />
                </div>
            </div>
        </div>
        </>
    );
}

export default Table;
