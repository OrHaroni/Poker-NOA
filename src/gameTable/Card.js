import React from 'react';

const Card = (props) => {
    return (
        <div className="card">
            <img src={props.pic} alt={`${props.value} of ${props.suit}`} />
        </div>
    );
};

export default Card;