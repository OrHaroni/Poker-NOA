const userServices = require('../services/users.js');

const getAllUsers = async () => {
    return await userServices.getAllUsers();
}

module.exports = {
    getAllUsers
}