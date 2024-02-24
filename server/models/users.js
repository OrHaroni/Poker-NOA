const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: { 
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isApprovedByEmail: {
    type: Boolean,
    default: false
  },
  moneyAmount: {
    type: Number,
    default: 0
  },
  lastTimeAddedMoney: Date, // Optional field
  biggestWin: {
    type: Number,
    default: 0
  },
  numberOfWins: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
