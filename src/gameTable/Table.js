
import React from 'react';
import Player from './Player';
import OurPlayer from './OurPlayer.js';
import './table.css'; // Import the table CSS file
import tableImg from '../assets/emptyTable.png'; // Import the image
import { root } from '../index.js';
import Lobby from '../lobby/lobby.js';
import { leaveTable } from '../serverCalls/Table.js';
import dealer_img from '../assets/dealer.jpg';

function Table(props) {
    const ClickBack =  async () => {
      // use leaveTable to leave the table, check the status and then go back to the lobby
      let status= await leaveTable(props.table.name, props.user.nickname);
      if(status===200){
        root.render(<Lobby user={props.user} />);
      }
      else{
        // maybe change the error message to a swal later.
        console.log("error leaving table");
      }
      };
      // represents the players on the table
    let playerOnTable=props.table.playersOnTable;
    // represents the players on the table except the user that is logged in
    let otherPlayers = [];
    let numOfPlayers = playerOnTable.length;
    
    



    // Loop through the players and create a Player component for each one
    for (let i = 0; i < numOfPlayers; i++) {
        if(playerOnTable[i].username!==props.user.username && i <= 3){
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
        <OurPlayer  name={props.user.nickname} className={"our-player"}/>
        </>
    );
}

export default Table;