// RangeInput.js
import React, { useState } from 'react';
import './RangeInput.css';

const RangeInput = ({ min, max, step, initialValue, onValueChange }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <span className="range-input-container">
      <input
        type="range"
        className="range-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      <span className="range-value">{value}</span>
    </span>
  );
};

export default RangeInput;
