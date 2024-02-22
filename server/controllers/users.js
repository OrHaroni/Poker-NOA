const userServices = require('../services/users.js');

const getAllUsers = async (req, res) => {
    const users = await userServices.getAllUsers();
    if(users) {
        res.status(200).json(users);
    }
    else{
        res.status(500);
    }
}

const validateUser = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password

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

const addUser = async (req, res) => {
    const new_user = req.body;

    let status = await userServices.addUser(new_user);
    //user taken
    if (status === 2) {
        res.status(302).json({});
    } //email taken
    else if (status === 1) {
        res.status(303).json({});
    }
    else {
        console.log("in 200");
        res.status(200).json({});
    }
}

module.exports = {
    getAllUsers, validateUser, addUser
}