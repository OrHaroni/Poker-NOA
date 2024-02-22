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

module.exports = {
    getAllUsers, validateUser
}