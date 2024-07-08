# Poker Game

## Description

This project is a multiplayer online poker game implemented in JavaScript, utilizing Node.js, Express.js, socket.io for real-time communication, and a client-side interface built with React or another frontend framework.

## Features

- **Login and Registration:** Users can create accounts and log into the system.
- **Leaderboard:** Displays rankings of players based on their performance.
- **Add Money:** Allows players to add virtual currency to their accounts.
- **Add Table:** Enables players to create new tables for gameplay.
- **Statistics:** Provides insights into gameplay metrics and player statistics.
- **Gameplay:** Implements classic Texas Hold'em rules for gameplay.
- **Spectator Mode:** Allows users to watch ongoing games without participating.

## Project Structure

The project is structured with a client-server architecture:

### Server

Located in the `server` folder, it uses Express.js with two main routes:
- `/users`: Handles user authentication and registration.
- `/table`: Manages table operations such as creating, joining, and spectating games.
Real-time communication with clients is managed through socket.io for gameplay updates and chat features.

### Client

Includes various pages:
- **Login:** Allows users to log into their accounts.
- **Register:** Enables new users to create accounts.
- **Leaderboard:** Displays rankings of players.
- **Add Money:** Facilitates adding virtual currency to the user's account.
- **Add Table:** Allows users to create new tables for gameplay.
- **Statistics:** Provides insights into player and game statistics.
- **Gameplay:** Implements the Texas Hold'em game interface.

## Getting Started

To run the server:
1. Install Node.js and npm.
2. Navigate to the `server` directory.
3. Install dependencies: `npm install`.
4. Start the server: `node App.js`.

To run the client:
1. Install Node.js and npm.
2. Navigate to the client directory.
3. Install dependencies: `npm install`.
4. Start the client application: `npm start`.

Ensure both server and client are running concurrently for full functionality.

## Technologies Used

- **Backend:** Node.js, Express.js, socket.io
- **Frontend:** React (or other frontend framework)
- **Database:** (Mention if applicable, e.g., MongoDB for user data)
- **Deployment:** (Optional, mention if deployed and where)

