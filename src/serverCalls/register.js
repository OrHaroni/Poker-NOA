import { userList } from "./login.js";


function isUserExist(username) {
    return userList.some(obj => obj.username === username);
};

function isEmailExist(email) {
    return userList.some(obj => obj.email === email);
};


const registerServer = (user) => {
    if (isUserExist(user.username)) {
        return -1; //User is exist
    } else if (isEmailExist(user.email)) {
        return -2; //Email is exist
    } else {
        userList.push(user);
        return 0;//Username and Email are not taken
    }
};

export default registerServer;
