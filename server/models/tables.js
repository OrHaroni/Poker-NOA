const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  name: {
    type: String,
    requied: true
  },
  password: {
    type: String,
    default: ''
  },
  bigBlind: {
    type: Number,
    required: true
  },
  smallBlind: {
    type: Number,
    required: true
  },
  numOfPlayers: {
    type: Number,
    required: true,
    default: 0
  },
  createdBy: {
    type: String,
    required: true
  }
});
const Table = mongoose.model('Table', tableSchema);

module.exports = Table;