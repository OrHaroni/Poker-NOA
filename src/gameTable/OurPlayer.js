import React, { useState } from 'react';
import RandomTwoCards from './RandomCard';
import './table.css';
import cards from '../assets/cards.png';

const OurPlayer = (props) => {
    // State to track whether to show cards or not
    const [showCards, setShowCards] = useState(true);
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
            <span className="player-name">{props.name}</span>
            <div className="player-cards">
                {showCards ? (
                    <div className='our-cards'>{generatedCards}</div> 
                ) : (
                    <img className="our-hidden-cards" src={cards} alt="Player Cards" />
                )}
            </div>
            <button onClick={() => setShowCards(!showCards)}>
                Toggle Cards
            </button>
            </div>
            </>

    );
};

export default OurPlayer;
