import React, { useState, useEffect } from 'react';
import { root } from '../index.js';
import GameTable from '../gameTable/GamePage.js';
import '../App.css';
import logo from '../assets/logo.png';
import Login from '../login/login.js';
import Swal from 'sweetalert2';
import Add_Money_Page from '../Add_Money_Page/Add_Money_Page.js';
import { GetAllTables } from '../serverCalls/lobby.js';
import { enterTable } from '../serverCalls/lobby.js';
import Add_Table_Page from '../Add_Table_Page/Add_Table_Page.js'

export function sendSwal(message, icon) {
  /* eslint-disable no-undef */
  Swal.fire({
    text: message,
    icon: icon,
  });
}

function Lobby(props) {
  const [tablesList, setTablesList] = useState([]);

  const fetchTables = async () => {
    try {
      const tables = await GetAllTables();
      setTablesList(tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const refresh = () => {
    fetchTables();
  };

  const clickBack = () => {
    props.socket.emit('exit', props.user.username);
    root.render(<Login />);
  };

  const GenericClickTable = async (tableName, event) => {
    const inputFieldPassword = event.target.parentElement.nextElementSibling.querySelector('input');
    let password = inputFieldPassword ? inputFieldPassword.value : '';

    const [table, retStatus] = await enterTable(tableName, password, props.user.username);
    if (retStatus === 200) {
      root.render(<GameTable table={table} user={props.user} socket={props.socket} />);
    } else if (retStatus === 404) {
      sendSwal("Incorrect password, try again.", "error");
    }
  };

  const TagTableList = tablesList.map((table, index) => (
    <tr key={index}>
      <td>{table.name}</td>
      <td>{table.createdBy}</td>
      <td>{table.playersOnTable.length}/{5}</td>
      <td>{table.moneyAmountOnTable}</td>
      <td>{table.smallBlind}/{table.bigBlind}</td>
      <td>
        <button className="tr-button" onClick={(event) => GenericClickTable(table.name, event)}>Join table</button>
      </td>
      <td>
        {table.password !== '' ? <input
          type="password"
          className="form-control"
          id={table.id}
        /> : null}
      </td>
    </tr>
  ));

  const addMoney = () => {
    root.render(<Add_Money_Page user={props.user} socket={props.socket} />);
  };

  const addTable = () => {
    root.render(<Add_Table_Page user={props.user} socket={props.socket} />);
  }

  return (
    <>
      <div className="upper-bg">
        <button className="exit-button" onClick={clickBack} id="buttonBack">
          Back
        </button>
        <button className="money-amount">
          Current money: {props.user.moneyAmount}
        </button>
      </div>
      <div className="background d-flex justify-content-center align-items-center">
        <div className="form-container form-container-extention p-4 rounded in-Login">
          <header className="reg-head text-center mb-4">
            Tables lobby
            <br></br>
            <button className="refresh-button" onClick={refresh}>Refresh</button>
            <button className="add-money" onClick={addMoney} id="addMoneyButtonHeader">Add Money</button>
            <button className="add-table-btn" onClick={addTable} id="addTableButton">Add Table</button>
          </header>
          <div className="lobby-table">
            <table>
              <thead>
                <tr>
                  <th>Table name</th>
                  <th>Created by</th>
                  <th>Number of players</th>
                  <th>Money on the table</th>
                  <th>Small/Big blind</th>
                  <th>Join</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>{TagTableList}</tbody>
            </table>
          </div>
        </div>
        <div className="image-container">
          <img src={logo} alt="Dealer" className="logo-image" />
        </div>
      </div>
    </>
  );
}

export default Lobby;
