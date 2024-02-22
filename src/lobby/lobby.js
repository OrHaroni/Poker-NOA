import React, { useState, useEffect } from 'react';
import { root } from '../index.js';
import GameTable from '../gameTable/gameTable';
import '../App.css';
import logo from '../assets/logo.png';
import Login from '../login/login.js';
import Swal from 'sweetalert2';
import Add_Money_Page from '../Add_Money_Page/Add_Money_Page.js';
import { GetAllTables } from '../serverCalls/lobby.js';
import { enterTable } from '../serverCalls/lobby.js';

export function sendSwal(message, icon) {
  /* eslint-disable no-undef */
  Swal.fire({
    text: message,
    icon: icon,
  });
}

function Lobby(props) {
  const clickBack = () => {
    root.render(<Login />);
  };
  const GenericClickTable = async (id, event) => {
    const inputFieldPassword = event.target.parentElement.nextElementSibling.querySelector('input');
    let password;
    if(inputFieldPassword) {
      password = inputFieldPassword.value
    }
    else {
      password = '';
    }

    //Check if correct password of table.
    const [table, retStatus] = await enterTable(id, password);
    if(retStatus === 200) {
      root.render(<GameTable table={table} user={props.user} />);
    }
    else if(retStatus === 404) {
      sendSwal("Incorrect password, try again.", "error");
    }
  };

  // List that demonstrates all the rows of the open tables
  // later on will get it from the DB

  const [tablesList, setTablesList] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tables = await GetAllTables();
        setTablesList(tables);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

// Initialize TagTableList inside the useEffect hook
const TagTableList = tablesList.map((table, index) => (
  <tr key={index}>
    <td>{table.name}</td>
    <td>{table.players_num}/{table.max_players_num}</td>
    <td>
    <button onClick={(event) => GenericClickTable(table.id, event)}>Join table</button>
    </td>
    <td>
      {table.password !== '' ? <input
        // onKeyDown={ClickRegister}
        type="password"
        className="form-control"
        id={table.id}
      /> : null}
    </td>
  </tr>
));


  // Function to handle adding money
  const addMoney = () => {
    root.render(<Add_Money_Page user={props.user} />);
  };

  return (
    <>
      <div className="upper-bg">
        <button className="exit-button" onClick={clickBack} id="buttonBack">
          Back
        </button>
        <button className="money-amount">
          money: {props.user.moneyAmount}
        </button>
      </div>
      <div className="background d-flex justify-content-center align-items-center">
        <div className="form-container form-container-extention p-4 rounded in-Login">
          <header className="reg-head text-center mb-4">
            Tables lobby
            {/* Move the "Add Money" button inside the header */}
          </header>
          <button className="add-money" onClick={addMoney} id="addMoneyButtonHeader">
              Add Money
            </button>
          <div className="lobby-table">
            <table>
              <thead>
                <tr>
                  <th>Table name</th>
                  <th>Number of players</th>
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
