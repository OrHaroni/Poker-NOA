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
    //clickRaise function to send 'raise' event to the server
    const clickRaise = () => {
        props.socket.emit('raise', props.table, props.name, 100);
    };
    //clickCall function to send 'call' event to the server
    const clickCall = () => {
        props.socket.emit('call',  props.table, props.name);
    };


    return (
        <>
            <div className="our-player">
                <div className='our-cards'>{generatedCards}</div>
                <span className='action-container'>
                    <button className="action-button" onClick={clickRaise}>
                        Raise
                    </button>
                    <button className="action-button" onClick={clickCall}>
                        Call
                    </button>
                </span>
            </div>
        </>

    );
};

export default OurPlayer;
