import React, { useState, useEffect, useRef } from 'react';
import Player from './Player';
import './table.css'; // Import the table CSS file
import dealer_img from '../assets/dealer.jpg';
import CommunitiCards from './CommuinityCards.js';
import AnimatedMessage from '../Animations/AnimatedMessage/AnimatedMessage.js';
import Timer from '../Animations/AnimatedTimer/Timer.js';
import logo from '../assets/logopng.png'

const serverIP = process.env.REACT_APP_SERVER_IP;
const serverPort = process.env.REACT_APP_SERVER_PORT;
const socketSrcURL = `http://${serverIP}:${serverPort}/socket.io/socket.io.js`;

// this io is the io from the index.html file on the public folder
<script src={socketSrcURL}></script>

/* This component represent the table, including showing the other players on the table */
function Table(props) {
    // State to control AnimatedMessage visibility
    const [showMessage, setShowMessage] = useState(false);

    /* The actual Animated Message */
    const [Message, setMessage] = useState(<></>);

    /* same as shwoMesage but for the timer in the end of the round */
    const [showTimer ,setShowTimer] = useState(false);

    /* State of all players cards */
    const [playersCardsList, setPlayersCardsList] = useState([[], [], [], []])

    /* State for specific player cards */
    const [otherPlayersCards, setOtherPlayersCards] = useState(<></>);

  /* Getting winner and print it on the screen */
  props.socket.off('getWinner').on('getWinner', async (winner) => {
    if(winner) {
    const new_message = "The winner is: " + winner;
    /* Make all timers go off */
    const updatedTimers = props.otherPlayers.map(player => false);
    props.setTimers(updatedTimers);
    setMessage(new_message);
    setShowTimer(true);
    /* wait 5 seconds with all cards open */
    await new Promise(resolve => setTimeout(resolve, 3000));
    setShowMessage(true);
    props.setGameRunning(false)
    setOtherPlayersCards(<></>);
    setPlayersCardsList([[], [], [], []]);

    /* Wait 5 seconds to let also the timer to run till next round */
    await new Promise(resolve => setTimeout(resolve, 3000));

    setShowTimer(false);
    setShowMessage(false);
    }
    else {
      props.setGameRunning(false)
      setOtherPlayersCards(<></>);
      setPlayersCardsList([[], [], [], []]);
    }

  });

    /* In the end of a round, getting all the cards */
    props.socket.off('getAllPlayersCards').on('getAllPlayersCards', async (CardsList) => {
      /* Getting all the cards, exluding ours and updating */
      if (props.ourPlayerCards != null) {
        const ourCard0 = props.ourPlayerCards[0];
        const ourCard1 = props.ourPlayerCards[1];
        const cards_list_without_our_player = CardsList.filter(pair => {
          if (pair.length > 0) {
              return pair[0].id !== ourCard0.id && pair[1].id !== ourCard1.id;
          }
          return true; // Include pairs with length 0
      });
        setPlayersCardsList(cards_list_without_our_player);
      }
});

  return (
    <>
        {showTimer ? 
        <>
          <Timer time={6}/>
        </> : null}

        {showMessage ? 
        <>
          <AnimatedMessage message={Message}/>
        </> : null}
      <div className="table">
        <img className='dealer-img' src={dealer_img} />
        <span className='table-money'>
          <img src={logo} alt="Logo" className="table-chips" />money: {props.moneyOnTable}$
        </span>
        <div className="players">
          {props.otherPlayers.map((player, index) => (
            <span>
              <Player 
                key={index}
                hasCards={props.playersCards[index]}
                playerCards={playersCardsList[index]}
                name={player} 
                money={props.playerMoney[index]} // Pass the money state to the Player component
                className={`player player${index + 1}`} 
                timer={props.timers[index]}
                isAi={props.playersAi[index]} 
                otherPlayersCards={otherPlayersCards}
                setOtherPlayersCards={setOtherPlayersCards}
                playersCardsList={playersCardsList}
              />
            </span>
          ))}
        </div>
        <CommunitiCards cards={props.communityCards}/>
      </div>      
    </>
  );
}

export default Table;
