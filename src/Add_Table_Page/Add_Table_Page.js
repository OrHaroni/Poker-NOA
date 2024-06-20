import React, { useRef } from 'react';
import '../App.css';
import Lobby, { sendSwal } from '../lobby/lobby.js';
import { root } from '../index.js';
import { addTable } from '../serverCalls/Add_Table_Page.js';
import logo from '../assets/logo.png';


function Add_Money_Page(props) {
  const ClickBack = () => {
    root.render(<Lobby user={props.user} socket={props.socket}  />);
  };

  const clickAddTable = async () => {
    const name = nameRef.current.value;
    const password = passRef.current.value;

    if (name === '') {
      sendSwal('Please enter a name', 'error');
      return;
    }
      const status = await addTable(name, password, props.user.nickname);
      if (status === 302) {
        sendSwal('This name is already taken', 'error');
      } else if (status === 303) {
        sendSwal('Max players in too big', 'error');
      }
      else if (status === 200) {
        sendSwal("added new table succesfully", "success");
        root.render(<Lobby user={props.user} socket={props.socket} />);
      } else {
        sendSwal("Unkown return status", "error");
      }

  };

  const nameRef = useRef(null);
  const passRef = useRef(null);


  return (
    <>
      <div className="upper-bg">
        <button className='exit-button' onClick={ClickBack}>Back</button>
      </div>
      <div className="background d-flex justify-content-center align-items-center">
        <div className="form-container form-container-extention p-4 rounded">
          <header className="reg-head text-center mb-4">Add new table</header>
          <div className="mb-5">
            <div className="form-group">
              <label htmlFor="tableName" className="form-label">
                Table Name<span class="required">*</span>
              </label>
              <input type="text" className="form-control" id="tableName" name="tableName" ref={nameRef} />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input type="password" className="form-control" id="password" name="password" ref={passRef} />
            </div>
            <button className="add-money" onClick={clickAddTable}>
              Add Table
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

export default Add_Money_Page;
