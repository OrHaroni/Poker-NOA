import {React, useState, useEffect} from 'react';
import '../App.css';
import Lobby, { sendSwal } from '../lobby/lobby.js';
import { root } from '../index.js';
import { getStat } from '../serverCalls/Statistics.js';
import logo from '../assets/logo.png';

function Statistics(props) {

    const ClickBack = () => {
        root.render(<Lobby user={props.user} socket={props.socket} />);
      };

      const [statistics, setStatistics] = useState({});

      const fetchStatistics = async () => {
  try {
    const [stats, status] = await getStat(props.user.username);
    console.log("this is stats: ", stats);

    // Check if stats.dateCreated is a valid Date object or convert it to one
    let dateCreated = new Date(stats.dateCreated);
    if (isNaN(dateCreated)) {
      console.error('Invalid dateCreated value:', stats.dateCreated);
    } else {
      /* Format the date */
      const day = dateCreated.getDate().toString().padStart(2, '0');
      const month = (dateCreated.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
      const year = dateCreated.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
      stats.dateCreated = formattedDate;
    }

    console.log("this is stats: ", stats);
    setStatistics(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
  }
};

      useEffect(() => {
        fetchStatistics();
      }, []);

    return(
    <>
        <div className="upper-bg">
          <button className='exit-button' onClick={ClickBack}>Back</button>
        </div>
        <div className="background d-flex justify-content-center align-items-center">
          <div className="form-container form-container-extention p-4 rounded stat-text">
            <header className="reg-head text-center mb-4 stat-head">{props.user.nickname}'s Statistics</header>
            <br></br>
            <br></br>
            <br></br>
            <div className="mb-5">
              <div className="form-group">
                <label htmlFor="tableName" className="form-label">
                  Rounds Played: {statistics.gamePlayed}
                </label>
            </div>
            <br></br>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Number Of Wins: {statistics.numOfWins}
                </label>
              </div>
              <br></br>
              <div className="form-group">
                <label htmlFor="tableName" className="form-label">
                  Highest win: {statistics.highestWin}$
                </label>
            </div>
            <br></br>
            <div className="form-group">
                <label htmlFor="tableName" className="form-label">
                  All time money won: {statistics.allTimeMoneyWon}$
                </label>
            </div>
            <br></br>
            <div className="form-group">
                <label htmlFor="tableName" className="form-label">
                  Current Money Amount: {statistics.moneyAmout}$
                </label>
            </div>
            <br></br>
            <div className="form-group">
                <label htmlFor="tableName" className="form-label">
                  Date Created: {statistics.dateCreated}
                </label>
            </div>
            <br></br>
            <div className="form-group">
                <label htmlFor="tableName" className="form-label">
                Win/Lose Ratio: {(statistics.numOfWins / statistics.gamePlayed * 100).toFixed(2)}%
                </label>
            </div>
            </div>
          </div>
          <div className="image-container">
            <img src={logo} alt="Dealer" className="logo-image" />
        </div>
        </div>
      </>
    );
}

export default Statistics;
