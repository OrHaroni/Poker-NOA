import React, { useState, useEffect } from 'react';
import Player from './Player';
import './table.css'; // Import the table CSS file
import tableImg from '../assets/emptyTable.png'; // Import the image
import dealer_img from '../assets/dealer.jpg';
import CommunitiCards from './CommuinityCards.js';
import AnimatedMessage from '../Animations/AnimatedMessage/AnimatedMessage.js';

// this io is the io from the index.html file on the public folder
<script src="http://127.0.0.1:8080/socket.io/socket.io.js"></script>

function Table(props) {
    // State to control AnimatedMessage visibility
    const [showMessage, setShowMessage] = useState(false);

    /* The actual Animated Message */
    const [Message, setMessage] = useState(<></>);

  // Fetch data to get the players on the table from the server (after a user joined the table or left the table).
  const fetchData = async (cards, players_with_money, size) => {
    if (cards) {
      props.setCommunityCards(cards);
    }
    let other_player = [];
    let player_money = [];
    let hasCards = [];
    for (let i = 0; i < size; i += 3) {
      if (players_with_money[i] === props.user.nickname) {
        continue;
      }
      other_player.push(players_with_money[i]);
      player_money.push(players_with_money[i + 1]);
      hasCards.push(players_with_money[i+2]);
    }
    props.setOtherPlayers(other_player);
    props.setPlayerMoney(player_money);
    props.setPlayersCards(hasCards);
  };

  useEffect(() => {
    const handleRender = (cards, players_with_money, size) => {
      fetchData(cards, players_with_money, size);
    };
    props.socket.on('render', handleRender);
    return () => {
      props.socket.off('render', handleRender);
    };
  }, [props.socket]);

  useEffect(() => {
    const handleWhosTurn = (player_index) => {
      const updatedTimers = props.timers.map((timer, i) => i === player_index);
      props.setTimers(updatedTimers);
    };
    props.socket.on('WhosTurn', handleWhosTurn);
    return () => {
      props.socket.off('WhosTurn', handleWhosTurn);
    };
  }, [props.socket, props.timers]);

  /* Getting winner and print it on the screen */
  props.socket.off('getWinner').on('getWinner', (winner) => {
    const new_message = "The winner is: " + winner;
    setMessage(new_message);
    setShowMessage(true);
  });

  return (
    <>
      <div className="table">
        <img className='dealer-img' src={dealer_img} />
        <div className="players">
          {props.otherPlayers.map((player, index) => (
            <span>
              <Player 
                key={index}
                cards={playersCards[index]}
                name={player} 
                money={props.playerMoney[index]} // Pass the money state to the Player component
                className={`player player${index + 1}`} 
                timer={props.timers[index]} 
              />
            </span>
          ))}
        </div>
        {showMessage ? 
        <AnimatedMessage message={Message}/> : null}
        <CommunitiCards cards={props.communityCards}/>
      </div>      
    </>
  );
}

export default Table;
