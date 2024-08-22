import React, { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import './AnimatedMessage.css'; // Ensure you have the CSS for styling

const MESSAGE_TIME = 3000; // Time to show the message in milliseconds

const AnimatedMessage = (props) => {
  const [visible, setVisible] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, MESSAGE_TIME + props.message.length * 100); // Show the text for 3 seconds + typing duration

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [props.message]);

  return (
    <div className={`start-game-message ${visible ? 'visible' : 'hidden'}`}>
      {visible && (
        <TypeAnimation
          sequence={[
            props.message,
            1000, // Wait 1 second after typing is done
          ]}
          wrapper="span"
          cursor={cursorVisible}
          repeat={0}
          style={{ display: 'inline-block' }}
          onFinishedTyping={() => setCursorVisible(false)}
        />
      )}
    </div>
  );
};

export default AnimatedMessage;
