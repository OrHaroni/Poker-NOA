import React from 'react';
import { root } from '../index.js';
import GameTable from '../gameTable/gameTable';
import '../App.css';
import logo from '../assets/logo.png';
import Login from '../login/login.js';

function Lobby() {
    const clickBack = () => {
        root.render(<Login />);
      };
    const GenericClickTable = () => {
        root.render(<GameTable/>);
    };

    //List that demonstrates all the rows of the open tables
    //later on will get it from the DB
    const tablesList = []

    //Initialization of tablesList
    for (let i = 1; i <= 3; i++) {
        tablesList.push(
            <tr>
                <td>Generic Table</td>
                <td>{i}/4</td>
                <td><button onClick={GenericClickTable}>Join table</button></td>
                <td><input
                    // onKeyDown={ClickRegister}
                    type="password"
                    className="form-control"
                    id="password"
                /></td>
            </tr>
        );
    }

    return (
        <>
            <div className="upper-bg">
            <button className='exit-button'
             onClick={clickBack}
             id="buttonBack">Back</button>
            </div>
            <div className="background d-flex justify-content-center align-items-center">
                <div className="form-container form-container-extention p-4 rounded in-Login">
                    <header className="reg-head text-center mb-4">
                        Tables lobby
                    </header>
                    <div class="lobby-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Table name</th>
                                    <th>Number of players</th>
                                    <th>Join</th>
                                    <th>Password</th>
                                </tr>
                            </thead>
                            <tbody>
                               {tablesList}
                            </tbody>
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