import React, { useEffect } from 'react';
import './table.css';
import cards from '../assets/cards.png';
import Timer from '../Animations/AnimatedTimer/Timer';
import logo from '../assets/logopng.png'
import genericPic from '../assets/generic_profile_pic.jpg'
import aiPic from '../assets/chatGptIcon.webp'
import Card from '../gameTable/Card.js'

const Player = (props) => {

    const profilePic = props.isAi ? aiPic : genericPic

    const GenericDeck = [
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

        useEffect(() => {
            console.log("this is props.playerCards: ", props.playerCards);
            const temp_var = props.playerCards;
            if(temp_var.length > 0) {
                console.log("In the if!");
                const card1 = GenericDeck.find(card => card.id === temp_var[0].id);
                const card2 = GenericDeck.find(card => card.id === temp_var[1].id);
                const generatedCards =   
                <>
                    <div className="right">
                        <Card pic={card1.pic} suit={card1.suit} value={card1.value} />
                    </div>
                    <div className="left">
                        <Card pic={card2.pic} suit={card2.suit} value={card2.value} />
                    </div>
                </>;
                props.setOtherPlayersCards(generatedCards)
            }
        }, [props.playersCardsList])

    return (
        <div className={props.className}>
            <img className='profile-pic' src={profilePic}/>
            {props.timer ? <Timer time={20}/> : null}
            <span className="player-name">{props.name}</span><br/>
            <img src={logo} alt="Logo" className="money-logo" />{props.money}$
            {(!props.hasCards) ?
                null :
                props.playerCards.length === 0 ?
                    <div className="player-cards">
                        <img className="hidden-cards" src={cards} alt="Player Cards" />
                    </div>
                    :
                    /*Showing cards in the end of round */
                    <div className="player-cards">
                        <div className="RandomCard">
                            {props.otherPlayersCards}
                        </div>
                    </div>
            }
        </div>
    );
};

export default Player;
