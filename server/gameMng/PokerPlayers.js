const PokerTable = require("./PokerTable");
const User = require("../models/users.js");
const socketManager = require("./socketManager.js");

// Get the io object
const io = socketManager.getIO();

// Attach the event listener to the io object
io.on('connection', (socket) => {
  // Listen for the 'raiseTable' event
  socket.on('raiseTable', async () => {
    console.log("Do Raise!");
  });
});
