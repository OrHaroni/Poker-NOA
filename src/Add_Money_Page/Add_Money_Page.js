import React, { useRef } from 'react';
import '../App.css';
import Lobby, { sendSwal } from '../lobby/lobby.js';
import { root } from '../index.js';

function Add_Money_Page() {
  const moneyAmountRef = useRef(null);

  const ClickAddMoney = () => {
    const enteredAmount = moneyAmountRef.current.value;

    if (enteredAmount !== '' && parseFloat(enteredAmount) > 0) {
      sendSwal('Money added successfully!', 'success');
      root.render(<Lobby />);
    } else {
      sendSwal('Please enter a valid amount.', 'error');
    }
  };

  return (
    <>
      <div className="upper-bg"></div>
      <div className="background d-flex justify-content-center align-items-center">
        <div className="form-container form-container-extention p-4 rounded">
          <header className="reg-head text-center mb-4">Add Money</header>
          <div className="form-group">
            <label htmlFor="moneyAmount" className="form-label">
              Amount:
            </label>
            <input
              className="form-control"
              id="moneyAmount"
              ref={moneyAmountRef}
            />
          </div>
          <button className="our-btn" onClick={ClickAddMoney}>
            Add Money
          </button>
        </div>
      </div>
    </>
  );
}

export default Add_Money_Page;
