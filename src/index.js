import React from 'react';
import Login from './login/login.js'
import Lobby from './lobby/lobby.js'
import { createRoot } from 'react-dom/client';


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Login />);
export { root };
