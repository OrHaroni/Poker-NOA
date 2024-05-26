import React, { useState, useEffect } from 'react';
import Player from './Player';
import OurPlayer from './OurPlayer.js';
import './table.css'; // Import the table CSS file
import tableImg from '../assets/emptyTable.png'; // Import the image
import { root } from '../index.js';
import Lobby from '../lobby/lobby.js';
import { leaveTable } from '../serverCalls/Table.js';
import dealer_img from '../assets/dealer.jpg';
import { getPlayersOnTable } from '../serverCalls/Table.js';
import CommunitiCards from './CommuinityCards.js';

// this io is the io from the index.html file on the public folder
<script src="http://127.0.0.1:8080/socket.io/socket.io.js"></script>

function Table(props) {
  const [otherPlayers, setOtherPlayers] = useState(props.table.playersOnTable);
  const [commuinityCards, setCommunityCards] = useState([]);
    // fecthData func to get the players on the table from the server (after a user joined the table or left the table ).
    const fetchData = async (cards) => {
      console.log("User got this cards for table from render: ", cards);
      if(cards){
        setCommunityCards(cards);
      }
      const updatedPlayers = await getPlayersOnTable(props.table.name);
      const updatedOtherPlayers = updatedPlayers.filter(player => player.nickname !== props.user.nickname);
      setOtherPlayers(updatedOtherPlayers);
    };
    // every time we get a render event, we will call the fetchData func and update the state.
    props.socket.off('render').on('render', fetchData);
  return (
    <>
      <div className="table">
        <img className='dealer-img' src={dealer_img} />
        <div className="players">
        {otherPlayers.map((player, index) => (
              <Player key={index} name={player.nickname} className={`player player${index + 1}`} />
            ))}
        </div>
        <CommunitiCards cards={commuinityCards}/>
      </div>      
    </>
  );
}

export default Table;