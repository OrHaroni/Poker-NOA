const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');


// Import the 'cors' package
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));

  });

const userRoutes = require('./routes/users.js');
// const chatRoutes = require('./routes/chat.js');
// const tokenRoutes = require('./routes/token.js');


// Middleware for parsing JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Using cors middleware to enable cross-origin requests
app.use(cors());

// // Connecting to MongoDB
// const mongoose = require('mongoose');
// const { copyFileSync } = require('fs');
// mongoose.connect("mongodb://127.0.0.1:27017/DB" , {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((e) => console.log(e));

// app.use(express.static('../public'));


app.use('/', userRoutes);
// app.use('/api/Tokens', tokenRoutes);
// app.use('/api/Chats', chatRoutes);

app.listen(process.env.PORT);

server.listen(8080);