
import React from 'react';
import Card from './Card';

const  CardsDeck = () => {
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

  // Generate a random index within the cards array
  const randomIndex = Math.floor(Math.random() * cards.length);
  const randomCard = cards[randomIndex];

  return (
      <div className="card">
          <div className="player-cards">
              {/* Render one random Card component */}
              <Card pic={randomCard.pic} suit={randomCard.suit} value={randomCard.value} />
          </div>
      </div>
  );
};

export default CardsDeck;