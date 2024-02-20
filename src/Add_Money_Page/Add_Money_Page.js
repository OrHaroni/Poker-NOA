import React, { useRef } from 'react';
import '../App.css';
import Lobby, { sendSwal } from '../lobby/lobby.js';
import { root } from '../index.js';

function Add_Money_Page() {
  const moneyAmountRef = useRef(null);

  const handleAddMoney = () => {
    const selectedAmount = moneyAmountRef.current.value;

    if (selectedAmount !== '') {
      sendSwal(`Money added successfully! Amount: ${selectedAmount}`, 'success');
      root.render(<Lobby />);
    } else {
      sendSwal('Please select a valid amount.', 'error');
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
            <select className="form-control" id="moneyAmount" ref={moneyAmountRef}>
              <option value="">Select Amount</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
            </select>
          </div>
          <button className="our-btn" onClick={handleAddMoney}>
            Add Money
          </button>
        </div>
      </div>
    </>
  );
}

export default Add_Money_Page;
