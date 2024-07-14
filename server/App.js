const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const socketManager = require("./socketManager.js");
require('dotenv').config({ path: './serverConfig.env' });


// Initialize socket.io
socketManager.initialize(server);

const io = socketManager.getIO();


io.on('connection', async (socket) => { 
         /*                       *
          *                       *
          *                       *
          * User Functionalities  *
          *                       *
          *                       * 
          *                       */
  // add user to connected users 
  // when user connect, we want to add him to the connected users with his socket id.
  socket.on('userConnected', async (username) => {
    socketManager.userConnected(username, socket)}); 

  socket.on('exit',async (username) => { 
      socketManager.exit(username);
    }); 

    socket.on('close', async () => { 
      socketManager.close();
   }); 

         /*                       *
          *                       *
          *                       *
          * Table Functionalities *
          *                       *
          *                       * 
          *                       */

  socket.on('joinScreenTable', async (tableName,username,nickname) => {
    socketManager.joinScreenTable(socket,tableName, username,nickname);
  });
  // if we get joinTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('joinTable', async (tableName, username, nickname, moneyToEnterWith) => {
    socketManager.joinTable(tableName, username, nickname, moneyToEnterWith);
  });
  // if we get joinTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('addBot', async (tableName) => {
    socketManager.addBot(tableName);
  });

  // if we get leaveTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('leaveTable', async (tableName, username) => {
    socketManager.leaveTable(tableName, username);
  });
   
  socket.on('standUp', async (tableName, nickname) => {
    socketManager.standUp(tableName, nickname);
  });
 }); 

// Import the 'cors' package
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));

  });

const userRoutes = require('./routes/users.js');
const tableRoutes = require('./routes/tables.js');

// Middleware for parsing JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Using cors middleware to enable cross-origin requests
app.use(cors());

// Connecting to MongoDB
const mongoose = require('mongoose');
const mongoDBUrl = `mongodb://${process.env.MONGO_DB_IP}:${process.env.MONGO_DB_PORT}/poker-noa`;
mongoose.connect(mongoDBUrl)
.then(() => console.log('poker-noa server is connected to MongoDB'))
.catch((e) => console.log(e));

app.use('/users', userRoutes);
app.use('/tables', tableRoutes);

const serverPort = process.env.SERVER_PORT;
server.listen(serverPort);