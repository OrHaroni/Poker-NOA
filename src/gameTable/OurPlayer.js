import React, { useState, useEffect } from 'react';
import './table.css';
import Card from './Card';
import Timer from '../Animations/AnimatedTimer/Timer';
import RangeInput from '../RangeInput/RangeInput';
import logo from '../assets/logopng.png'
import { sendSwal } from '../lobby/lobby';
import generic_pic from '../assets/generic_profile_pic.png'

const OurPlayer = (props) => {
    // State to store the generated card
    const [generatedCards, setGeneratedCard] = useState(null);

    /* State of the buttons */
    const [buttonsState, setButtonsState] = useState(0);

    /* The actual buttons */
    const [buttons, setButtons] = useState(<span className='action-container'></span>);

    // State to control Timer visibility
    const [showTimer, setShowTimer] = useState(false);

    // State to control AnimatedMessage visibility
    const [showMessage, setShowMessage] = useState(false);

    const [moneyToCall, setMoneyToCall] = useState(0);

    // State to keep track of the range input value
    const [raiseAmount, setRaiseAmount] = useState(0);

    // State to keep track of our money
    const [ourPlayerMoney, setOurPlayerMoney] = useState(Number(props.money));

    // State to keep track of the minimum player money
    const [minPlayerMoney, setMinPlayerMoney] = useState(Math.min(...props.playerMoney));

    useEffect(() => {
        // Update minPlayerMoney whenever props.playerMoney changes
        setMinPlayerMoney(Math.min(...props.playerMoney));
    }, [props.playerMoney]);


    /* Socket that tell us its our turn */
    props.socket.off('yourTurn').on('yourTurn', (moneyToCallArg) => {
        setRaiseAmount(0);
        /* If its our turn then the game in running */
        props.setGameRunning(true)
        setMoneyToCall(moneyToCallArg);
        if (moneyToCallArg === 0) {
            setButtonsState(1); 
        }
        else if (moneyToCallArg === ourPlayerMoney) {
            setButtonsState(3); 
        }
        else {
            setButtonsState(2);
        }
        // Show Timer
        setShowTimer(true);
        setShowMessage(true);
        
    }
);
    /* Update our money */
useEffect(() => {
    setOurPlayerMoney(Number(props.money));
}, [props.money]);

    /* Changing the buttons layout */
    useEffect(() => {
        let temp_buttons;
        switch (buttonsState) {
            case 1:
                /* Case where we can check */
                temp_buttons =
                <span className='action-container'>
                    <Timer time={20}/>
                    <button className="action-button" onClick={clickCheck}>
                        Check
                    </button>
                    <div className='raise-with-range'>
                        <button className="action-button" onClick={clickRaise}>
                            Raise
                        </button>
                        <RangeInput
                            min={moneyToCall}
                            max={Math.min(ourPlayerMoney, minPlayerMoney)}
                            step={50}
                            initialValue={raiseAmount}
                            onValueChange={setRaiseAmount} /* Empty */
                        />
                    </div>
                    <button className="action-button" onClick={clickFold}>
                        Fold
                    </button>
                </span>;
                break;
            case 2:
                /* Case where we can't check */
                temp_buttons =
                <span className='action-container'>
                    <Timer time={20}/>
                    <div className='raise-with-range'>
                        <button className="action-button" onClick={clickRaise}>
                            Raise
                        </button>
                        <RangeInput
                            min={moneyToCall}
                            max={Math.min(ourPlayerMoney, minPlayerMoney)}
                            step={50}
                            initialValue={raiseAmount}
                            onValueChange={setRaiseAmount}
                        />
                    </div>
                    <button className="action-button" onClick={clickCall}>
                        Call {moneyToCall}
                    </button>
                    <button className="action-button" onClick={clickFold}>
                        Fold
                    </button>
                </span>;
                break;
                case 3:
                /* In all-in */
                temp_buttons =
                <span className='action-container'>
                    <Timer time={20}/>
                    <button className="action-button" onClick={clickCall}>
                        All-In {moneyToCall}
                    </button>
                    <button className="action-button" onClick={clickFold}>
                        Fold
                    </button>
                </span>;
                break;
            default:
                temp_buttons = <span className='action-container'></span>;
                break;
        }
        setButtons(temp_buttons);
      }, [buttonsState, moneyToCall, raiseAmount,minPlayerMoney]);
    
    //clickRaise function to send 'raise' event to the server
    const clickRaise = () => {
        if (Number(ourPlayerMoney) <= 0) {
            sendSwal("Cant raise, dont have money", 'warning');
            return;
        }
        if(Number(raiseAmount) === 0) {
            sendSwal("Cant raise, 0", 'warning');
            return;
        }
        setButtonsState(0); 
        setOurPlayerMoney(Number(ourPlayerMoney) - Number(raiseAmount));
        // cover the option that user raises and our player need to call and choose to raise
        setShowTimer(false);
        setShowMessage(false);
        props.socket.emit('playerAction',"raise", raiseAmount);
    };
    //clickCall function to send 'call' event to the server
    const clickCall = () => {
        setButtonsState(0); 
        setOurPlayerMoney(Number(ourPlayerMoney) - Number(moneyToCall));
        setMoneyToCall(0);
        setShowTimer(false);
        props.socket.emit('playerAction',"call",null);
    };
    const clickCheck = () => {
        setButtonsState(0); 
        setShowTimer(false);
        props.socket.emit('playerAction',"check",null);
    };
    const clickFold = () => {
        setButtonsState(0); 
        setShowTimer(false);
        props.socket.emit('playerAction',"fold",null);
    };

    // initialize all state variables
    const initializeStates = () => {
        setGeneratedCard(null);
        setButtonsState(0);
        setButtons(<span className='action-container'></span>);
        setShowTimer(false);
        setShowMessage(false);
        setMoneyToCall(0);
        setRaiseAmount(0);
    };
  

    /* Get cards from the Server and make it into html */
    props.socket.off('getCards').on('getCards', (cards) => {
        initializeStates();
        if(cards) {
        const card1 = GenericDeck.find(card => card.id === cards[0].id);
        const card2 = GenericDeck.find(card => card.id === cards[1].id);
        props.setOurPlayerCards([card1, card2]);
        const generated = 
            <div className="RandomCard">
                <div className="right">
                    <Card pic={card1.pic} suit={card1.suit} value={card1.value} />
                </div>
                <div className="left">
                    <Card pic={card2.pic} suit={card2.suit} value={card2.value} />
                </div>
            </div>;
        setGeneratedCard(generated);
        }
        else {
            props.setOurPlayerCards(null);
            /* if the server sent null, player dont have cards */
            setGeneratedCard(<div className="RandomCard">
                <div className="right"></div>
                <div className="left"></div>
            </div>);
        }
        
    });

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

    return (
        <>
            <div className="our-player">
            <div className='profile-container'>
                <img className='profile-pic' src={generic_pic} alt='Profile Pic'/>
                <div>
                    {props.name}
                    <br/>
                    <img src={logo} alt="Logo" className="money-logo" />
                    {Number(ourPlayerMoney)}$
                </div>
            </div>
                <div className='our-cards'>{generatedCards}</div>
                <span className='action-container'>
                    {buttons}
                </span>
            </div>
        </>
    );
};

export default OurPlayer;
