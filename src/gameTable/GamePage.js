import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Table from './Table.js'; // Import the Table component
import './table.css';
import Modal from 'react-modal';
import { root } from '../index.js';
import Lobby from '../lobby/lobby.js';
import { joinUserIntoTable } from '../serverCalls/lobby.js';
import { sendSwal } from '../lobby/lobby.js';
import { leaveTable } from '../serverCalls/Table.js';
import OurPlayer from './OurPlayer.js';
import { io } from 'socket.io-client';

// this io is the io from the index.html file on the public folder
<script src="http://127.0.0.1:8080/socket.io/socket.io.js"></script>

// Set the app element for react-modal
Modal.setAppElement('#root');

function GameTable(props) {
  const [showModal, setShowModal] = useState(false);
  const [money, setMoney] = useState(0);
  const moneyRef = useRef(0);
  const [satDown, setSatDown] = useState(false);
  const [otherPlayers, setOtherPlayers] = useState(props.table.Players);
  const [playerMoney, setPlayerMoney] = useState([]); // State to store the money of other players
  const [communityCards, setCommunityCards] = useState([]);
  const [timers, setTimers] = useState([false, false, false, false]);
  const [moneyAmount, setMoneyAmount] = useState(0); // Use state for moneyAmount
  const [playersCards, setPlayersCards] = useState([]);
  const [mongoMoney, setMongoMoney] = useState(props.user.moneyAmount); // my money from mongo, meaning all my money in my user (not on table)
  const [ourPlayerCards, setOurPlayerCards] = useState(null);


  const fetchData = async (cards, players_with_money, size) => {
    if (cards) {
      setCommunityCards(cards);
    }
    let other_player = [];
    let player_money = [];
    let hasCards = [];
    for (let i = 0; i < size; i += 3) {
      if (players_with_money[i] === props.user.nickname) {
        setMoneyAmount(players_with_money[i + 1]); // Update the state
        continue;
      }
      other_player.push(players_with_money[i]);
      player_money.push(players_with_money[i + 1]);
      hasCards.push(players_with_money[i+2]);
    }
    setOtherPlayers(other_player);
    setPlayerMoney(player_money);
    setPlayersCards(hasCards);
  };

  useEffect(() => {
    const handleRender = (cards, players_with_money, size, money_on_table) => {
      fetchData(cards, players_with_money, size);
    };
    props.socket.on('render', handleRender);
    return () => {
      props.socket.off('render', handleRender);
    };
  }, [props.socket]);

  useEffect(() => {
    const handleWhosTurn = (current_player_nickname) => {
      /* Updating the timers from the ohter players that its his turn*/
      const updatedTimers = otherPlayers.map(player =>
      player === current_player_nickname);
      setTimers(updatedTimers);
    };
    props.socket.on('WhosTurn', handleWhosTurn);
    return () => {
      props.socket.off('WhosTurn', handleWhosTurn);
    };
  }, [props.socket, timers]);

  const sitDownHandler = () => {
    setShowModal(true); // Open the modal when sitting down
  };

  const standUpHandler = () => {
    if(ourPlayerCards){
      sendSwal("Cant stand up with cards, fold please", "warning");
    }
    else{
      setSatDown(false);
      props.socket.emit('playerAction',"fold" , null);
      // add the money on the table to the user
      setMongoMoney(Number(mongoMoney) + Number(moneyAmount));
      props.user.moneyAmount = Number(mongoMoney) + Number(moneyAmount);
      props.socket.emit('standUp', props.table.name, props.user.nickname);
    }
  };

  const ClickEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      ClickEnterGame();
    }
  };

  const ClickEnterGame = async () => {
    const moneyToEnterWith = moneyRef.current.value;
    const tableName = props.table.name;
    const username = props.user.username;
    const nickname = props.user.nickname;
    const retStatus = await joinUserIntoTable(tableName, username, moneyToEnterWith);
    if (retStatus === 200) {
      props.socket.emit('joinTable', tableName, username, nickname, moneyToEnterWith);
      setShowModal(false);
      setSatDown(true);
      setMongoMoney(mongoMoney - moneyToEnterWith);
      props.user.moneyAmount = mongoMoney - moneyToEnterWith;
      setMoneyAmount(moneyToEnterWith); // Update the state
    } else if (retStatus === 301) {
      sendSwal("You don't have enough money!", "error");
    } else if (retStatus === 302) {
      sendSwal("This table is full!", "error");
    } else if (retStatus === 303) {
      sendSwal("You must enter with 50 times the big blind at least! 100 is the minimum entrance", "error");
    } else {
      sendSwal("Unknown problem, 404", "error");
    }
  };

  const ClickClose = async () => {
    setShowModal(false); // Close the modal
  };

  const ClickBack = async () => {
    const status = await leaveTable(props.table.name, props.user.nickname);
    if (status === 200) {
      props.socket.emit('leaveTable', props.table.name, props.user.username);
      root.render(<Lobby user={props.user} socket={props.socket} />);
    } else {
      console.log("Error leaving table");
    }
  };
  const addBot = async () => {
    props.socket.emit('addBot', props.table.name);
  };
  return (
    <>
      <Modal isOpen={showModal} className="form form-container p-4 rounded modal-center">
        <button className="exit-button modal-back-button" onClick={ClickClose} id="buttonBack">
          X
        </button>
        <div className="modal-content">
          <h2 className='amount-h'>Enter Amount</h2>
          <input
            type="text"
            className='form-control'
            value={money}
            onKeyDown={ClickEnter}
            onChange={(e) => {
              const input = e.target.value;
              if (/^\d*$/.test(input)) {
                setMoney(input);
              }
            }}
            ref={moneyRef}
          />
          <button className='enter-button' onClick={ClickEnterGame}>Enter Game</button>
        </div>
      </Modal>
      <div className="upper-bg">
        {!satDown && (
            <button className="exit-button" onClick={ClickBack} id="buttonBack">
              Back
            </button>
          )}
        <button className="money-amount">
          money: {mongoMoney}
        </button>
      </div>
      <Container className="container">
        <Row>
          <Col>
            <Table 
              table={props.table} 
              user={props.user} 
              players_num={4} 
              socket={props.socket} 
              otherPlayers={otherPlayers}
              playerMoney={playerMoney}
              setOtherPlayers={setOtherPlayers}
              setPlayerMoney={setPlayerMoney}
              communityCards={communityCards}
              setCommunityCards={setCommunityCards}
              timers={timers}
              setTimers={setTimers}
              playersCards={playersCards}
              setPlayersCards={setPlayersCards}
            />
            {satDown && <OurPlayer
            name={props.user.nickname}
            money={moneyAmount}
            className={"our-player"}
            socket={props.socket}
            tablename={props.table.name}
            ourPlayerCards={ourPlayerCards}
            setOurPlayerCards={setOurPlayerCards}
             />}
            {!satDown && (
              <button className="exit-button" onClick={sitDownHandler} id="buttonBack">
                Sit Down
              </button>
            )}
            {satDown && (
              <button className="exit-button" onClick={standUpHandler} id="buttonBack">
                Stand up
              </button>
            )}
          {satDown && (
                <button className="bot-button" onClick={addBot} id="buttonBack">
                Add bot
              </button>
            )}

          </Col>
        </Row>
      </Container>
    </>
  );
}

export default GameTable;
