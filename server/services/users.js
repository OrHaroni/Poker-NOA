const {userList} = require('../models/users.js');


const getAllUsers = async () => {
    return userList;
}

const validateUser = async (username, password) => {

    const user = userList.find(user => user.username === username);
    if (user && user.password === password) {
        return user; // Return the user if found and password matches
    } else {
        return null; // Return null if user not found or password doesn't match
    }
};

module.exports = {
    getAllUsers, validateUser
  }