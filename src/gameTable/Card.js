import React from 'react';

const Card = ({ pic, suit, value }) => {
  return (
    <div className="card">
      <img src={pic} alt={`${value} of ${suit}`} />
    </div>
  );
};

export default Card;