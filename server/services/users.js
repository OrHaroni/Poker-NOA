const {userList} = require('../models/users.js');


const getAllUsers = async () => {
    return userList;
}
const isEmailTaken = async (email) => {
    if(userList.find(user => user.email === email)) {
        return true;
    }
    return false;
}
const isUsernameTaken = async (username) => {
    if(userList.find(user => user.username === username)) {
        return true;
    }
    return false;
}

const validateUser = async (username, password) => {

    const user = userList.find(user => user.username === username);
    if (user && user.password === password) {
        return user; // Return the user if found and password matches
    } else {
        return null; // Return null if user not found or password doesn't match
    }
};

const addUser = async (user) => {
    const username = user.username;
    const email = user.email;

    if(await isUsernameTaken(username)) {
        return 2; //username taken 
    }
    else if (await isEmailTaken(email)) {
        return 1; //email taken
    }
    //Now know its not taken
    user.moneyAmount = 0;
    userList.push(user);
    return 0; //everything good
}

const addMoney = async (username, moneyAmount) => {
    const user = userList.find(user => user.username === username);
    if(user) {
        console.log("Found user!");
        console.log(user);
        user.moneyAmount = 250;
        console.log(user);
    }
    return user;
}

module.exports = {
    getAllUsers, validateUser, addUser, addMoney
  }