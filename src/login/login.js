// src/LoginPage.js
import React from 'react';
import { root } from '../index.js';
import '../App.css';
import logo from '../assets/logo.png'; 
import Register from '../register/Register';
import Lobby from '../lobby/lobby.js';

function Login() {
  const ClickLogin = () => {
    root.render(<Lobby />);
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
      <button className='exit-button' onClick={ClickExit}>Back</button>
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
              type="text"
              className="form-control"
              id="username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
            />
          </div>
          <button
            onClick={ClickLogin}
            id="buttonLogin"
            type="submit"
            className="btn btn-primary btn-block our-btn"
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