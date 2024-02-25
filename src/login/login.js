// src/LoginPage.js
import React, { useRef } from 'react';
import { root } from '../index.js';
import '../App.css';
import logo from '../assets/logo.png';
import Register from '../register/Register';
import Lobby from '../lobby/lobby.js';
import { sendSwal } from '../lobby/lobby.js';
import { userExistsWithPassword, GetAllUser } from '../serverCalls/login.js'

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
      if (status !== 200) {
        sendSwal("Username or Password are incorrect", "error");
      } else {
        root.render(<Lobby user={user} />);
      }
    }
  };
  const ClickRegister = () => {
    root.render(<Register />);
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
          <button
            onClick={ClickLogin}
            id="buttonLogin"
            type="submit"
            className="login-btn"
          >
            Login
          </button>
          <button
            onClick={ClickRegister}
            id="not-reg"
            type="submit"
            className="btn btn-link btn-block text-secondary"
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