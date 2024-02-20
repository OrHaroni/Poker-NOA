
import React, { useState } from 'react';
import Card from './Card';

const  CardsDeck = () => {
  const [usedCards, setUsedCards] = useState([]);
  const cards = [
    { pic: require('../assets/cards/10_of_clubs.png'), suit: 'Clubs', value: '10' },
    { pic: require('../assets/cards/10_of_diamonds.png'), suit: 'Diamonds', value: '10' },
    { pic: require('../assets/cards/10_of_hearts.png'), suit: 'Hearts', value: '10' },
    { pic: require('../assets/cards/10_of_spades.png'), suit: 'Spades', value: '10' },
    { pic: require('../assets/cards/2_of_clubs.png'), suit: 'Clubs', value: '2' },
    { pic: require('../assets/cards/2_of_diamonds.png'), suit: 'Diamonds', value: '2' },
    { pic: require('../assets/cards/2_of_hearts.png'), suit: 'Hearts', value: '2' },
    { pic: require('../assets/cards/2_of_spades.png'), suit: 'Spades', value: '2' },
    { pic: require('../assets/cards/3_of_clubs.png'), suit: 'Clubs', value: '3' },
    { pic: require('../assets/cards/3_of_diamonds.png'), suit: 'Diamonds', value: '3' },
    { pic: require('../assets/cards/3_of_hearts.png'), suit: 'Hearts', value: '3' },
    { pic: require('../assets/cards/3_of_spades.png'), suit: 'Spades', value: '3' },
    { pic: require('../assets/cards/4_of_clubs.png'), suit: 'Clubs', value: '4' },
    { pic: require('../assets/cards/4_of_diamonds.png'), suit: 'Diamonds', value: '4' },
    { pic: require('../assets/cards/4_of_hearts.png'), suit: 'Hearts', value: '4' },
    { pic: require('../assets/cards/4_of_spades.png'), suit: 'Spades', value: '4' },
    { pic: require('../assets/cards/5_of_clubs.png'), suit: 'Clubs', value: '5' },
    { pic: require('../assets/cards/5_of_diamonds.png'), suit: 'Diamonds', value: '5' },
    { pic: require('../assets/cards/5_of_hearts.png'), suit: 'Hearts', value: '5' },
    { pic: require('../assets/cards/5_of_spades.png'), suit: 'Spades', value: '5' },
    { pic: require('../assets/cards/6_of_clubs.png'), suit: 'Clubs', value: '6' },
    { pic: require('../assets/cards/6_of_diamonds.png'), suit: 'Diamonds', value: '6' },
    { pic: require('../assets/cards/6_of_hearts.png'), suit: 'Hearts', value: '6' },
    { pic: require('../assets/cards/6_of_spades.png'), suit: 'Spades', value: '6' },
    { pic: require('../assets/cards/7_of_clubs.png'), suit: 'Clubs', value: '7' },
    { pic: require('../assets/cards/7_of_diamonds.png'), suit: 'Diamonds', value: '7' },
    { pic: require('../assets/cards/7_of_hearts.png'), suit: 'Hearts', value: '7' },
    { pic: require('../assets/cards/7_of_spades.png'), suit: 'Spades', value: '7' },
    { pic: require('../assets/cards/8_of_clubs.png'), suit: 'Clubs', value: '8' },
    { pic: require('../assets/cards/8_of_diamonds.png'), suit: 'Diamonds', value: '8' },
    { pic: require('../assets/cards/8_of_hearts.png'), suit: 'Hearts', value: '8' },
    { pic: require('../assets/cards/8_of_spades.png'), suit: 'Spades', value: '8' },
    { pic: require('../assets/cards/9_of_clubs.png'), suit: 'Clubs', value: '9' },
    { pic: require('../assets/cards/9_of_diamonds.png'), suit: 'Diamonds', value: '9' },
    { pic: require('../assets/cards/9_of_hearts.png'), suit: 'Hearts', value: '9' },
    { pic: require('../assets/cards/9_of_spades.png'), suit: 'Spades', value: '9' },
    { pic: require('../assets/cards/ace_of_clubs.png'), suit: 'Clubs', value: 'Ace' },
    { pic: require('../assets/cards/ace_of_diamonds.png'), suit: 'Diamonds', value: 'Ace' },
    { pic: require('../assets/cards/ace_of_hearts.png'), suit: 'Hearts', value: 'Ace' },
    { pic: require('../assets/cards/ace_of_spades.png'), suit: 'Spades', value: 'Ace' },
    { pic: require('../assets/cards/queen_of_hearts.png'), suit: 'Hearts', value: 'Queen' },
    { pic: require('../assets/cards/queen_of_spades.png'), suit: 'Spades', value: 'Queen' },
    { pic: require('../assets/cards/king_of_clubs.png'), suit: 'Clubs', value: 'King' },
    { pic: require('../assets/cards/king_of_diamonds.png'), suit: 'Diamonds', value: 'King' },
    { pic: require('../assets/cards/king_of_hearts.png'), suit: 'Hearts', value: 'King' },
    { pic: require('../assets/cards/king_of_spades.png'), suit: 'Spades', value: 'King' },
    { pic: require('../assets/cards/ace_of_clubs.png'), suit: 'Clubs', value: 'Ace' },
    { pic: require('../assets/cards/ace_of_diamonds.png'), suit: 'Diamonds', value: 'Ace' },
    { pic: require('../assets/cards/ace_of_hearts.png'), suit: 'Hearts', value: 'Ace' },
    { pic: require('../assets/cards/ace_of_spades.png'), suit: 'Spades', value: 'Ace' },
  ];

  // Function to draw a random card and remove it from the available cards
  const drawRandomCardAndRemove = () => {
    const availableCards = cards.filter(card => !usedCards.includes(card));
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const randomCard = availableCards[randomIndex];
    setUsedCards([...usedCards, randomCard]);
    return randomCard;
};
  const randomCard1 = drawRandomCardAndRemove();
  const randomCard2 = drawRandomCardAndRemove();


  return (
    <div className="RandomCard">
        {/* Render two random Card components */}
        <div className="right">
            <Card pic={randomCard1.pic} suit={randomCard1.suit} value={randomCard1.value} />
        </div>
        <div className="left">
            <Card pic={randomCard2.pic} suit={randomCard2.suit} value={randomCard2.value} />
        </div>
    </div>
);
};

export default CardsDeck;