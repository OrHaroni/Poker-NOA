
import React, { useState } from 'react';
import Card from './Card';

const  CardsDeck = () => {
  const cards = [
    { id: 1, pic: require('../assets/cards/10_of_clubs.png'), suit: 'Clubs', value: '10' },
    { id: 2, pic: require('../assets/cards/10_of_diamonds.png'), suit: 'Diamonds', value: '10' },
    { id: 3, pic: require('../assets/cards/10_of_hearts.png'), suit: 'Hearts', value: '10' },
    { id: 4, pic: require('../assets/cards/10_of_spades.png'), suit: 'Spades', value: '10' },
    { id: 5, pic: require('../assets/cards/2_of_clubs.png'), suit: 'Clubs', value: '2' },
    { id: 6, pic: require('../assets/cards/2_of_diamonds.png'), suit: 'Diamonds', value: '2' },
    { id: 7, pic: require('../assets/cards/2_of_hearts.png'), suit: 'Hearts', value: '2' },
    { id: 8, pic: require('../assets/cards/2_of_spades.png'), suit: 'Spades', value: '2' },
    { id: 9, pic: require('../assets/cards/3_of_clubs.png'), suit: 'Clubs', value: '3' },
    { id: 10, pic: require('../assets/cards/3_of_diamonds.png'), suit: 'Diamonds', value: '3' },
    { id: 11, pic: require('../assets/cards/3_of_hearts.png'), suit: 'Hearts', value: '3' },
    { id: 12, pic: require('../assets/cards/3_of_spades.png'), suit: 'Spades', value: '3' },
    { id: 13, pic: require('../assets/cards/4_of_clubs.png'), suit: 'Clubs', value: '4' },
    { id: 14, pic: require('../assets/cards/4_of_diamonds.png'), suit: 'Diamonds', value: '4' },
    { id: 15, pic: require('../assets/cards/4_of_hearts.png'), suit: 'Hearts', value: '4' },
    { id: 16, pic: require('../assets/cards/4_of_spades.png'), suit: 'Spades', value: '4' },
    { id: 17, pic: require('../assets/cards/5_of_clubs.png'), suit: 'Clubs', value: '5' },
    { id: 18, pic: require('../assets/cards/5_of_diamonds.png'), suit: 'Diamonds', value: '5' },
    { id: 19, pic: require('../assets/cards/5_of_hearts.png'), suit: 'Hearts', value: '5' },
    { id: 20, pic: require('../assets/cards/5_of_spades.png'), suit: 'Spades', value: '5' },
    { id: 21, pic: require('../assets/cards/6_of_clubs.png'), suit: 'Clubs', value: '6' },
    { id: 22, pic: require('../assets/cards/6_of_diamonds.png'), suit: 'Diamonds', value: '6' },
    { id: 23, pic: require('../assets/cards/6_of_hearts.png'), suit: 'Hearts', value: '6' },
    { id: 24, pic: require('../assets/cards/6_of_spades.png'), suit: 'Spades', value: '6' },
    { id: 25, pic: require('../assets/cards/7_of_clubs.png'), suit: 'Clubs', value: '7' },
    { id: 26, pic: require('../assets/cards/7_of_diamonds.png'), suit: 'Diamonds', value: '7' },
    { id: 27, pic: require('../assets/cards/7_of_hearts.png'), suit: 'Hearts', value: '7' },
    { id: 28, pic: require('../assets/cards/7_of_spades.png'), suit: 'Spades', value: '7' },
    { id: 29, pic: require('../assets/cards/8_of_clubs.png'), suit: 'Clubs', value: '8' },
    { id: 30, pic: require('../assets/cards/8_of_diamonds.png'), suit: 'Diamonds', value: '8' },
    { id: 31, pic: require('../assets/cards/8_of_hearts.png'), suit: 'Hearts', value: '8' },
    { id: 32, pic: require('../assets/cards/8_of_spades.png'), suit: 'Spades', value: '8' },
    { id: 33, pic: require('../assets/cards/9_of_clubs.png'), suit: 'Clubs', value: '9' },
    { id: 34, pic: require('../assets/cards/9_of_diamonds.png'), suit: 'Diamonds', value: '9' },
    { id: 35, pic: require('../assets/cards/9_of_hearts.png'), suit: 'Hearts', value: '9' },
    { id: 36, pic: require('../assets/cards/9_of_spades.png'), suit: 'Spades', value: '9' },
    { id: 37, pic: require('../assets/cards/ace_of_clubs.png'), suit: 'Clubs', value: 'Ace' },
    { id: 38, pic: require('../assets/cards/ace_of_diamonds.png'), suit: 'Diamonds', value: 'Ace' },
    { id: 39, pic: require('../assets/cards/ace_of_hearts.png'), suit: 'Hearts', value: 'Ace' },
    { id: 40, pic: require('../assets/cards/ace_of_spades.png'), suit: 'Spades', value: 'Ace' },
    { id: 41, pic: require('../assets/cards/king_of_clubs.png'), suit: 'Clubs', value: 'King' },
    { id: 42, pic: require('../assets/cards/king_of_diamonds.png'), suit: 'Diamonds', value: 'King' },
    { id: 43, pic: require('../assets/cards/king_of_hearts.png'), suit: 'Hearts', value: 'King' },
    { id: 44, pic: require('../assets/cards/king_of_spades.png'), suit: 'Spades', value: 'King' },
    { id: 45, pic: require('../assets/cards/queen_of_clubs.png'), suit: 'Clubs', value: 'Queen' },
    { id: 46, pic: require('../assets/cards/queen_of_diamonds.png'), suit: 'Diamonds', value: 'Queen' },
    { id: 47, pic: require('../assets/cards/queen_of_hearts.png'), suit: 'Hearts', value: 'Queen' },
    { id: 48, pic: require('../assets/cards/queen_of_spades.png'), suit: 'Spades', value: 'Queen' },
    { id: 49, pic: require('../assets/cards/jack_of_clubs.png'), suit: 'Clubs', value: 'Jack' },
    { id: 50, pic: require('../assets/cards/jack_of_diamonds.png'), suit: 'Diamonds', value: 'Jack' },
    { id: 51, pic: require('../assets/cards/jack_of_hearts.png'), suit: 'Hearts', value: 'Jack' },
    { id: 52, pic: require('../assets/cards/jack_of_spades.png'), suit: 'Spades', value: 'Jack' }
];


  // Function to draw a random card and remove it from the available cards
  const drawRandomCardAndRemove = () => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    const randomCard = cards.splice(randomIndex, 1)[0];
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