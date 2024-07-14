const userServices = require('../services/users.js');
const connectedUsers = require('../models/connectedUsers.js');

/* Return all users from leaderbaord */
const getAllUsers = async (req, res) => {
    const users = await userServices.getAllUsers();
    if(users) {
        res.status(200).json(users);
    }
    else{
        res.status(500).json({});
    }
}

/* Validate user for login */
const validateUser = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password
    // Check if the user is connectedUser with his username
    const connectedUser = await connectedUsers.findOne({ username: username });
    if (connectedUser) {
        res.status(405).json({});
        return;
    }
    const user = await userServices.validateUser(username, password);
    //if we have user and password
    if(user) {
        res.status(200).json(user);
    }
    else {
        //not found (incorrect username or password)
        res.status(404).json({});
    }
}

/* add new user for register */
const addUser = async (req, res) => {
    const new_user = req.body;
    new_user.dateCreated = new Date();

    let status = await userServices.addUser(new_user);
    //user taken
    if (status === 2) {
        res.status(302).json({});
    } //email taken
    else if (status === 1) {
        res.status(303).json({});
    }
    else if (status === 3) {
        res.status(304).json({});
    }
    else {
        res.status(200).json({});
    }
}

/* Add money to an exsisting user */
const addMoney = async (req, res) => {
    let username = req.body.username;
    let moneyAmount = req.body.moneyAmount;

    let updatedUser = await userServices.addMoney(username, moneyAmount);
    if(updatedUser) {
        //if we didnt could add
        if(updatedUser.moneyAmount === moneyAmount) {
            res.status(301).json(updatedUser);
        }
        else {
            res.status(200).json(updatedUser);
        }
    }
    else {
        res.status(404).json({});
    }
}

/* statistics for statistics page */
const getStat = async (req, res) => {
    let username = req.params.username;

    let userStat = await userServices.getStat(username);
    if(userStat) {
        res.status(200).json(userStat);
    }
    else {
        res.status(404).json({});
    }

}

module.exports = {
    getAllUsers, validateUser, addUser, addMoney, getStat
}