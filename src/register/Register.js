// src/Register.js
import React from 'react';
import logo from '../assets/logo.png';
import { root } from '../index.js';
import Login from '../login/login.js';

function Register() {
  const ClickLogin = () => {
    root.render(<Login />);
  };

  return (
    <>
      <div className="upper-bg"></div>
      <div className="background d-flex justify-content-center align-items-center">
        <div className="form-container p-4 rounded in-Login">
          <header className="reg-head text-center mb-4">Register</header>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              onKeyDown={ClickLogin}
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
              onKeyDown={ClickLogin}
              type="password"
              className="form-control"
              id="password"
            />
          </div>
          <div className="mb-3 confirm-password-container"> {/* Add this container */}
            <label htmlFor="confirm-password" className="form-label t">
            Confirm Password
            </label>
            <input
              onKeyDown={ClickLogin}
              type="password"
              className="form-control confirm-password"
              id="confirm-password"
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
            onClick={ClickLogin}
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

export default Register;