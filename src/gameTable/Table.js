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

    /* same as shwoMesage but for the timer in the end of the round */
    const [showTimer ,setShowTimer] = useState(false);

    /* State of all players cards */
    const [playersCardsList, setPlayersCardsList] = useState([[], [], [], []])

    /* State for specific player cards */
    const [otherPlayersCards, setOtherPlayersCards] = useState(<></>);

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

  });

    /* In the end of a round, getting all the cards */
    props.socket.off('getAllPlayersCards').on('getAllPlayersCards', async (CardsList) => {
      console.log("in the getAllPlayerCards1!");
      /* Getting all the cards, exluding ours and updating */
      console.log(props.ourPlayerCards);
      if (props.ourPlayerCards != null) {
        const ourCard0 = props.ourPlayerCards[0];
        const ourCard1 = props.ourPlayerCards[1];
        console.log("in the getAllPlayerCards1!");
        const cards_list_without_our_player = CardsList.filter(pair => {
          if (pair.length > 0) {
              return pair[0].id !== ourCard0.id && pair[1].id !== ourCard1.id;
          }
          return true; // Include pairs with length 0
      });
      console.log("in the getAllPlayerCards1!");
        console.log("new list without our cards: ", cards_list_without_our_player);
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
          <img src={logo} alt="Logo" className="table-chips" />money: {moneyOnTable.current}
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
