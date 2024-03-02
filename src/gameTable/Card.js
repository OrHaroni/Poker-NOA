import React from 'react';
import './table.css';
const Card = (props) => {
    return (
        <div className="card">
            <img className="card-img" src={props.pic} alt={`${props.value} of ${props.suit}`} />
        </div>
    );
};

export default Card;