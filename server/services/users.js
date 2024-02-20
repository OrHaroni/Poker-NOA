const userList = require('../models/users.js');


const getAllUsers = async () => {
    return userList;
}

module.exports = {
    getAllUsers
  }