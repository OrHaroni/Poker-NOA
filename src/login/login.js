
import React, {useRef } from 'react';
import { root } from '../index.js'
import GameTable from '../gameTable/gameTable.js';

function Login() {
    const ClickRegister = () => {
        root.render(<GameTable />);
      }; 
    return(
        <>
        <div className="upper-bg">
        </div>
        <div className="background d-flex justify-content-center align-items-center">
          <div className="form-container p-4 rounded in-Login">
            <header className="reg-head">Login</header><br></br>
            <label htmlFor="exampleFormControlInput1" className="form-label">Username</label><br></br>
            <input onKeyDown={ClickRegister} type="Display Name" className="form-control"></input><br></br>
            <label htmlFor="inputPassword5" className="form-label">Password</label><br></br>
            <input onKeyDown={ClickRegister} type="password" className="form-control" aria-labelledby="passwordHelpBlock"></input><br></br>
            <button onClick={ClickRegister} id="buttonLogin" type="submit" className="btn btn-primary our-btn">Login</button>
            <button onClick={ClickRegister} id="not-reg" type="submit" className="btn btn-primary our-btn">Not register? Click here to sign up</button>
          </div>
        </div>
      </>
    )
}
export default Login;