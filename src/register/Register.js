// src/Register.js
import React, {useRef} from 'react';
import logo from '../assets/logo.png';
import { root } from '../index.js';
import Login from '../login/login.js';
import { sendSwal } from '../lobby/lobby.js';
import registerServer from '../serverCalls/register.js';

function Register() {

  const username = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const password_confirm = useRef(null);

  const ClickEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      ClickRegister();
    }
  };

  const ClickRegister = () => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(username.current.value === '') {
      sendSwal("Username is empty", "warning");
    }
    else if(email.current.value === '') {
      sendSwal("email is empty", "warning");
    }
    else if(!emailRegex.test(email.current.value)) {
      sendSwal("Invalid email", "warning");
    }
    else if(password.current.value === '') {
      sendSwal("Password is empty", "warning");
    }
    else if(password_confirm.current.value === ''){
      sendSwal("Confirm password is empty", "warning");
    }
    else if (password.current.value !== password_confirm.current.value) {
      sendSwal("password and confirm password are not the same", "warning");
    }
    else {
      const newUser = {"username": username.current.value,
                        "password": password.current.value,
                        "email": email.current.value};
      let validation = registerServer(newUser);
      //Invalid username
      if (validation === -1) {
        sendSwal("Username is already taken", "warning");
      } //Invalid email
      else if (validation === -2) {
        sendSwal("Email is already taken", "warning");
      } else if(validation === 0) {
        root.render(<Login />);
      }
    }
    //Make some things to add the new user to the database and than only
    //if you added him, go to login again.
  };
  const ClickBack = () => {
    root.render(<Login />);
  };

  return (
    <>
      <div className="upper-bg">
      <button className='exit-button' onClick={ClickBack}>Back</button>
      </div>
      <div className="background d-flex justify-content-center align-items-center">
        <div className="form-container p-4 rounded in-Login">
        <div className="mb-5">
          <header className="reg-head text-center mb-4">Register</header>
            <div className="mb-4">
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
                <label htmlFor="username" className="form-label">
                  Email address
                </label>
                <input
                  onKeyDown={ClickEnter}
                  type="text"
                  className="form-control"
                  id="email"
                  ref={email}
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
              <div className="mb-3"> 
                <label htmlFor="confirm-password" className="form-label t">
                Confirm Password
                </label>
                <input
                  onKeyDown={ClickEnter}
                  type="password"
                  className="form-control confirm-password"
                  id="confirm-password"
                  ref={password_confirm}
                />
              </div>

            </div>
            <button
              onClick={ClickRegister}
              id="buttonLogin"
              type="submit"
              className="btn btn-primary btn-block our-btn"
            >
              Register
            </button>
          </div>
        </div>
        <div className="image-container">
          <img src={logo} alt="Dealer" className="logo-image" />
        </div>
      </div>
    </>
  );
}

export default Register;