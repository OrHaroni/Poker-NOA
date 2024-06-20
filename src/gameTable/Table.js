import React, { useState, useEffect, useRef } from 'react';
import Player from './Player';
import './table.css'; // Import the table CSS file
import dealer_img from '../assets/dealer.jpg';
import CommunitiCards from './CommuinityCards.js';
import AnimatedMessage from '../Animations/AnimatedMessage/AnimatedMessage.js';
import Timer from '../Animations/AnimatedTimer/Timer.js';
import logo from '../assets/logopng.png'

// this io is the io from the index.html file on the public folder
<script src="http://127.0.0.1:8080/socket.io/socket.io.js"></script>

function Table(props) {
    // State to control AnimatedMessage visibility
    const [showMessage, setShowMessage] = useState(false);

    /* The actual Animated Message */
    const [Message, setMessage] = useState(<></>);

    const moneyOnTable = useRef(0);

  // Fetch data to get the players on the table from the server (after a user joined the table or left the table).
  const fetchData = async (cards, players_with_money, size, money_on_table) => {
    if (cards) {
      props.setCommunityCards(cards);
    }
    let other_player = [];
    let player_money = [];
    let hasCards = [];
    let isAi = [];
    for (let i = 0; i < size; i += 4) {
      if (players_with_money[i] === props.user.nickname) {
        continue;
      }
      other_player.push(players_with_money[i]);
      player_money.push(players_with_money[i + 1]);
      hasCards.push(players_with_money[i+2]);
      isAi.push(players_with_money[i+3]);
    }
    props.setOtherPlayers(other_player);
    props.setPlayerMoney(player_money);
    props.setPlayersCards(hasCards);
    props.setPlayersAi(isAi);
    moneyOnTable.current = money_on_table;
  };

  useEffect(() => {
    const handleRender = (cards, players_with_money, size, money_on_table) => {
      fetchData(cards, players_with_money, size, money_on_table);
    };
    props.socket.on('render', handleRender);
    return () => {
      props.socket.off('render', handleRender);
    };
  }, [props.socket]);

  /* Getting winner and print it on the screen */
  props.socket.off('getWinner').on('getWinner', async (winner) => {
    const new_message = "The winner is: " + winner;
    /* Make all timers go off */
    const updatedTimers = props.otherPlayers.map(player => false);
    props.setTimers(updatedTimers);
    setMessage(new_message);
    setShowMessage(true);
    /* Wait 5 seconds to let also the timer to run till next round */
    await new Promise(resolve => setTimeout(resolve, 5000));

    setShowMessage(false);

  });

  return (
    <>
      <div className="table">
        <img className='dealer-img' src={dealer_img} />
        <span className='table-money'>
          <img src={logo} alt="Logo" className="money-logo" />money: {moneyOnTable.current}
        </span>
        <div className="players">
          {props.otherPlayers.map((player, index) => (
            <span>
              <Player 
                key={index}
                cards={props.playersCards[index]}
                name={player} 
                money={props.playerMoney[index]} // Pass the money state to the Player component
                className={`player player${index + 1}`} 
                timer={props.timers[index]}
                isAi={props.playersAi[index]} 
              />
            </span>
          ))}
        </div>
        {showMessage ? 
        <>
          <Timer time={5}/>
          <AnimatedMessage message={Message}/>
        </> : null}
        <CommunitiCards cards={props.communityCards}/>
      </div>      
    </>
  );
}

export default Table;
