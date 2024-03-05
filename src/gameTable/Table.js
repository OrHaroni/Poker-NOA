import React, { useState, useEffect } from 'react';
import Player from './Player';
import Modal from 'react-modal';
import { root } from '../index.js';
import Lobby from '../lobby/lobby.js';
import { leaveTable } from '../serverCalls/Table.js';
import dealer_img from '../assets/dealer.jpg';

function Table(props) {
  
  

  const ClickBack = async () => {
    let status = await leaveTable(props.table.name, props.user.nickname);
    if (status === 200) {
      root.render(<Lobby user={props.user} />);
    } else {
      console.log("error leaving table");
    }
  };



  let playerOnTable = props.table.playersOnTable;
  let otherPlayers = [];
  let numOfPlayers = playerOnTable.length;

  for (let i = 0; i < numOfPlayers; i++) {
    if (playerOnTable[i].username !== props.user.username && i <= 3) {
      otherPlayers.push(
        <Player name={playerOnTable[i].nickname} className={`player player${i + 1}`} />
      );
    }
  }

  return (
    <>
      <div className="upper-bg">
        <button className="exit-button" onClick={ClickBack} id="buttonBack">
          Back
        </button>
        <button className="money-amount">
          money: {props.user.moneyAmount}
        </button>
      </div>
      <div className="table">
        <img className='dealer-img' src={dealer_img} />
        <div className="players">
          {otherPlayers}
          
        </div>
      </div>
      
    </>
  );
}

export default Table;
