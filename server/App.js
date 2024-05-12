const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const connectedUsers =require('./models/connectedUsers.js'); 
const socketManager = require("./socketManager.js"); // Adjust the path if needed


// Initialize socket.io
socketManager.initialize(server);

const io = socketManager.getIO();


// when starting the serer,delete all the connected users (in case the server was not closed properly and the connected users were not deleted). 
// const deleteAllConnectedUsers = async () => { 
//   //delete all the connected users 
// await connectedUsers.deleteMany({}).exec(); 
// } 
// deleteAllConnectedUsers(); 



io.on('connection', async (socket) => { 
  // add user to connected users 
  // when user connect, we want to add him to the connected users with his socket id.
  socket.on('userConnected', async(username) => { 
    const temp = new connectedUsers({ username: username, socketId: socket.id }); 
      await temp.save(); 
  }); 
 
  // if we get joinTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('joinTable', async (tableName, username) => {
    const table = await Table.findOne({ name: tableName });
    // if its the first player on the table, we dont want to send him the render event because he is the one that joined the table.
    if(table.playersOnTable.length > 1 || table.spectators.length > 0) {
    // Iterate over each player on the table , if its not the user that joined the table, send him the render event.
    for (const player of table.playersOnTable) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player.nickname });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that joined the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
    // now want to send the spectators the render event.

    for (const spectator of table.spectators) {
      const usernameToRender = await connectedUsers.findOne({ username: spectator });
      console.log("usernameToRender: ", usernameToRender, "socketId: ", usernameToRender.socketId);
      io.to(usernameToRender.socketId).emit('render');
      }
  }
});
  // if we get leaveTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('leaveTable', async (tableName, username) => {
    const table = await Table.findOne({ name: tableName });
    // Iterate over each player on the table , if its not the user that leave the table, send him the render event.
    for (const player of table.playersOnTable) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player.nickname });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
    // now want to send the spectators the render event.
    for (const player of table.spectators) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
  });
  socket.on('standUp', async (tableName, username) => {
    // after stand up the username is a spectator so we need to change the database, add him to the spectators and remove him from the players on table.
    const table = await Table.findOne({ name: tableName });
    // remove the user from the players on table
    table.playersOnTable = table.playersOnTable.filter(player => player.nickname !== username);
    // add the user to the spectators
    table.spectators.push(username);
    await table.save();
    // Iterate over each player on the table , if its not the user that leave the table, send him the render event.
    for (const player of table.playersOnTable) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player.nickname });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
    // now want to send the spectators the render event.
    for (const player of table.spectators) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
  });
  socket.on('exit',async (username) => { 
    // remove user from connected users 
    await connectedUsers.deleteOne({ username
    });
  }); 
 
  
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
  
   socket.on('close', async () => { 
     // Disconnect users and clean up resources here 
    //delete all the connected users 
    await connectedUsers.deleteMany({}).exec(); 
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


         /*                       *
          *                       *
          *                       *
          * Table Functionalities *
          *                       *
          *                       * 
          *                       */

  // if we get joinTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('joinTable', async (tableName, username) => {
    socketManager.joinTable(tableName, username);
  });

  // if we get leaveTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('leaveTable', async (tableName, username) => {
    socketManager.leaveTable(tableName, username);
  });
   


         /*                       *
          *                       *
          *                       *
          * Game Functionalities  *
          *                       *
          *                       * 
          *                       */
 socket.on('raiseTable', socketManager.TableRaise);

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