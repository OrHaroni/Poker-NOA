import React, { useState, useEffect } from 'react';
import '../App.css';
import { root } from '../index.js'; // Assuming root is used for rendering
import { GetAllUser } from '../serverCalls/login.js'; // Adjust the path as needed
import Login from '../login/login.js';
import logo from '../assets/logo.png'

function Leaderboard(props) {
  const ClickBack = () => {
    root.render(<Login />);
  };

  const [users, setUsers] = useState([]);

  /* Getting all the players and sorting them by all time money won using server call */
  const fetchUsers = async () => {
    try {
      const usersData = await GetAllUser();
      // Sort acsending due to all time money won
      usersData.sort((p1, p2) => p2.allTimeMoneyWon - p1.allTimeMoneyWon);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  /* Fetch users when openning this component */
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="upper-bg">
        <button className='exit-button' onClick={ClickBack}>Back</button>
      </div>
      <div className="background">
        <div className="form-container form-container-lobby">
          <h2 className="reg-head">Leaderboard</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nickname</th>
                <th>Number of Wins</th>
                <th>All Time Money Won</th>
                <th>Biggest Wins</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.nickname}</td>
                  <td>{user.numberOfWins}</td>
                  <td>{user.allTimeMoneyWon}</td>
                  <td>{user.highestMoneyWon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="image-container">
            <img src={logo} alt="Dealer" className="logo-image" />
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
