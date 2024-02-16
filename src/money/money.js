import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../App.css';

// Import sendSwal if it's defined in another file
import Lobby, { sendSwal } from '../lobby/lobby.js';
import { root } from '../index.js';

function Money({ onAddMoney: parentAddMoney }) {
    const [moneyAmount, setMoneyAmount] = useState(0);

    const handleChange = (e) => {
        setMoneyAmount(e.target.value);
    };

    const handleAddMoney = () => {
        if (moneyAmount > 0) {
            // Call the onAddMoney function passed from the parent component
            // Move the sendSwal inside this block to ensure it's only triggered when the button is clicked
            sendSwal('Money added successfully!', 'success');
            root.render(<Lobby />);
        } else {
            // Optionally, you can include a check to prevent showing the alert for invalid amounts during initial render
            if (moneyAmount !== '') {
                sendSwal('Please enter a valid amount.', 'error');
            }
        }
    };

    return (
        <>
            <div className="upper-bg">
            </div>
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
                            value={moneyAmount}
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

export default Money;
