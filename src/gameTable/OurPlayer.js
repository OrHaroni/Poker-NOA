import React, { useState } from 'react';
import RandomTwoCards from './RandomCard';
import './table.css';
import cards from '../assets/cards.png';

const OurPlayer = (props) => {
    // State to store the generated card
    const [generatedCards, setGeneratedCard] = useState(null);

    // Initial generation of random cards, if not already generated
    if (!generatedCards) {
        const newCards = RandomTwoCards(); // Assuming RandomCard returns a card
        setGeneratedCard(newCards);
    }


    return (
        <>
            <div className="our-player">
                <div className='our-cards'>{generatedCards}</div>
                <span className='action-container'>
                    <button className="action-button">
                        Raise
                    </button>
                    <button className="action-button">
                        Call
                    </button>
                </span>
            </div>
        </>

    );
};

export default OurPlayer;
