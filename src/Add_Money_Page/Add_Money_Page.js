import React, { useRef } from 'react';
import Swal from 'sweetalert2';
import '../App.css';
import Lobby, { sendSwal } from '../lobby/lobby.js';
import { root } from '../index.js';

function Add_Money_Page({ onAddMoney: parentAddMoney }) {
  const moneyAmountRef = useRef(0);

  const handleChange = (e) => {
    // Update the current value of the useRef
    moneyAmountRef.current = e.target.value;
  };

  const handleAddMoney = () => {
    if (moneyAmountRef.current > 0) {
      sendSwal('Money added successfully!', 'success');
      root.render(<Lobby />);
    } else {
      if (moneyAmountRef.current !== '') {
        sendSwal('Please enter a valid amount.', 'error');
      }
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
              onChange={handleChange}
            />
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
