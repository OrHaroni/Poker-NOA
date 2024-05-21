const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const socketManager = require("./socketManager.js"); // Adjust the path if needed


// Initialize socket.io
socketManager.initialize(server);

const io = socketManager.getIO();


io.on('connection', async (socket) => { 
   socket.on('disconnect',async () => { 
     // remove user from connected users 
    //  await connectedUsers.deleteOne({ socketId: socket.id }); 
    //  // run in all the tables and remove the user from the players on table and remove him from the spectators.
    //   const tables = await Table.find({});
    //   for (const table of tables) {
    //     // remove the user from the players on table
    //     table.playersOnTable = table.playersOnTable.filter(player => player.nickname !== username);
    //     // remove the user from the spectators
    //     table.spectators = table.spectators.filter(player => player !== username);
    //     await table.save();
    //   }
   }); 
  

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

  // if we get joinTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('joinTable', async (tableName, username, nickname, moneyToEnterWith) => {
    socketManager.joinTable(socket,tableName, username, nickname, moneyToEnterWith);
  });

  // if we get leaveTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('leaveTable', async (tableName, username) => {
    socketManager.leaveTable(tableName, username);
  });
   
  socket.on('standUp', async (tableName, username) => {
    socketManager.standUp(tableName, username);
  });


         /*                       *
          *                       *
          *                       *
          * Game Functionalities  *
          *                       *
          *                       * 
          *                       */

       


      
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
// const tokenRoutes = require('./routes/token.js');


// Middleware for parsing JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Using cors middleware to enable cross-origin requests
app.use(cors());

// Connecting to MongoDB
const mongoose = require('mongoose');
// const { copyFileSync } = require('fs');
mongoose.connect("mongodb://127.0.0.1:27017/poker-noa")
  .then(() => console.log('poker-noa server is connected to MongoDB'))
  .catch((e) => console.log(e));

// app.use(express.static('../public'));


app.use('/users', userRoutes);
app.use('/tables', tableRoutes);
// app.use('/api/Chats', chatRoutes);

app.listen(process.env.PORT);

server.listen(8080);