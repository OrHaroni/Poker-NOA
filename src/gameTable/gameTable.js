import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Table from './Table'; // Import the Table component
import './table.css';
import Modal from 'react-modal';
import { root } from '../index.js';
import Lobby from '../lobby/lobby.js';
import { joinUserIntoTable } from '../serverCalls/lobby.js';
import { sendSwal } from '../lobby/lobby.js';
import OurPlayer from './OurPlayer.js';

function GameTable(props) {
  const [showModal, setShowModal] = useState(false);
  const [money, setMoney] = useState(0);
  const moneyRef = useRef(0);
  const [satDown, setSatDown] = useState(false);

  const sitDownHandler = () => {
    setShowModal(true); // Open the modal when sitting down
    
  };

  const standUpHandler = () => {
    setSatDown(false);
  };

  const ClickEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      ClickEnterGame();
    }
  };

  const ClickEnterGame = async () => {
    setSatDown(true);
    const moneyToEnterWith = moneyRef.current.value;
    const tableName = props.table.name;
    const username = props.user.username;

    const retStatus = await joinUserIntoTable(tableName, username, moneyToEnterWith);
    if (retStatus === 200) {
      setShowModal(false);
    } else if (retStatus === 301) {
      sendSwal("You dont have enough money!", "error");
    } else if (retStatus === 302) {
      sendSwal("This table is full!", "error");
    } else {
      sendSwal("Unknown problem, 404", "error");
    }
  };

  const ClickClose = async () => {
      setShowModal(false); // Open the modal when sitting dow
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
      <Container className="container">
        <Row>
          <Col>
            <Table table={props.table} user={props.user} players_num={4} />
            {satDown && <OurPlayer name={props.user.nickname} className={"our-player"} />}
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
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default GameTable;