const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  name: {
    type: String,
    requied: true
  },
  players_num: {
    type: Number,
    required: true
  },
  max_players_num: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    default: ''
  },
  moneyAmountOnTable: {
    type: Number,
    default: 0
  },
  bigBlind: {
    type: Number,
    required: true
  },
  smallBlind: {
    type: Number,
    required: true
  },
  cardOnTable: {
    type: [String],
    default: []
  },
   playersOnTable: [{
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

  }],
  createdBy: {
    type: String,
    required: true
  }
});
const Table = mongoose.model('Table', tableSchema);

module.exports = Table;