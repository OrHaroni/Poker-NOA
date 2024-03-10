const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  name: {
    type: String,
    requied: true
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
  //object that is a list with default of empty list
  playersOnTable: {
    type: [{
      nickname: { 
        type: String
      },
      moneyAmount: {
        type: Number,
        default: 0
      }
    }],
    default: []
  },
  spectators: {
    type: [String],
    default: []
  },
  createdBy: {
    type: String,
    required: true
  }
});
const Table = mongoose.model('Table', tableSchema);

module.exports = Table;