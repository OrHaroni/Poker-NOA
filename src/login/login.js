// src/LoginPage.js
import React, { useRef } from 'react';
import { root } from '../index.js';
import '../App.css';
import logo from '../assets/logo.png';
import Register from '../register/Register';
import Lobby from '../lobby/lobby.js';
import { sendSwal } from '../lobby/lobby.js';
import { userExistsWithPassword } from '../serverCalls/login.js'
import { io } from 'socket.io-client';
import Leaderboard from '../Leaderboard/Leaderboard.js';

const serverIP = process.env.REACT_APP_SERVER_IP;
const serverPort = process.env.REACT_APP_SERVER_PORT;
const socketSrcURL = `http://${serverIP}:${serverPort}/socket.io/socket.io.js`;

// this io is the io from the index.html file on the public folder
<script src={socketSrcURL}></script>
const serverURL = `http://${serverIP}:${serverPort}`
const socket = io(serverURL, { transports: ['websocket'] });

function Login() {

  const username = useRef(null);
  const password = useRef(null);

  const ClickEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      ClickLogin();
    }
  };
  const ClickLogin = async () => {
    if (username.current.value === '') {
      sendSwal("Username is empty", "error");
    }
    else if (password.current.value === '') {
      sendSwal("Password is empty", "error");
    }
    else {
      //Check if the username and password are correct for 1 user.
      let [user, status] = await userExistsWithPassword(username.current.value, password.current.value);
      if (status === 405) {
        sendSwal("User is already connected", "error");
        return;
      } else if (status !== 200) {
        sendSwal("Username or Password are incorrect", "error");
      } else {
        // if the status is good, we want to use socket io to send to the server that the user is connected. (mainly to know the socket id of the user)
        socket.emit('userConnected', user.username);
        // sending the socket as well so we can use it later on to listen to events.
        root.render(<Lobby user={user} socket={socket}/>);
      }
    }
  };
  const ClickRegister = () => {
    root.render(<Register />);
  };

  const ClickLeaderboard = () => {
    root.render(<Leaderboard />);
  };
  const ClickExit = () => {
    //Exit the window
  };

  return (
    <>
      <div className="upper-bg">
        <button className='exit-button' onClick={ClickExit}>Exit</button>
      </div>
      <div className="background d-flex justify-content-center align-items-center">
        <div className="form-container p-4 rounded in-Login">
          <header className="reg-head text-center mb-4">
            Login
          </header>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              onKeyDown={ClickEnter}
              type="text"
              className="form-control"
              id="username"
              ref={username}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              onKeyDown={ClickEnter}
              type="password"
              className="form-control"
              id="password"
              ref={password}
            />
          </div>
          <span className='login-buttons'>
              <button
                onClick={ClickLogin}
                id="buttonLogin"
                type="submit"
                className="login-btn"
              >
                Login
              </button>
              <button
                onClick={ClickLeaderboard}
                id="buttonLeaderboard"
                className="leaderboard-btn"
              >
                Hall Of Fame
              </button>
          </span>
          <button
            onClick={ClickRegister}
            id="not-reg"
            type="submit"
            className="btn btn-link btn-block text-secondary not-reg"
          >
            Not registered? Click here to sign up
          </button>
        </div>
        <div className="image-container">
          <img src={logo} alt="Dealer" className="logo-image" />
        </div>
      </div>
    </>
  );
}

export default Login;