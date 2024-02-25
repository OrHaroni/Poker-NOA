const userSchema = require('../models/users.js');


// Function to retrieve all users
async function getAllUsers() {
    try {
      const users = await userSchema.find({});
      return users;
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw error;
    }
  }
// Function to check if an email is already taken
async function isEmailTaken(email) {
    try {
      const user = await userSchema.findOne({ "email": email });
      return (user !== null); // If user is found, email is taken
    } catch (error) {
      console.error('Error checking email availability:', error);
      throw error;
    }
  }
  
  // Function to check if a username is already taken
  async function isUsernameTaken(username) {
    try {
      const user = await userSchema.findOne({ "username": username });
      return (user !== null); // If user is found, username is taken
    } catch (error) {
      console.error('Error checking username availability:', error);
      throw error;
    }
  }

// Function to check if a username is already taken
async function isNicknameTaken(nickname) {
  try {
    const user = await userSchema.findOne({ "nickname": nickname });
    return (user !== null); // If user is found, username is taken
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw error;
  }
}

const validateUser = async (username, password) => {
    try {
        const user = await userSchema.findOne({ "username": username, "password": password });
        return user; // If user is found, authentication is successful
      } catch (error) {
        console.error('Error validation user:', error);
        throw error;
      }
};

const addUser = async (user) => {
    const username = user.username;
    const email = user.email;
    try{

    if(await isUsernameTaken(username)) {
        return 2; //username taken 
    }
    else if (await isEmailTaken(email)) {
        return 1; //email taken
    }
    //If didnt input any nickname. gives the username as nickname
    if (user.nickname === '') {
        user.nickname = user.username;
    }
    
    if(await isNicknameTaken(user.nickname)) {
      return 3; //nickname is taken
    }
    
    const newUser = new userSchema(user);
    await newUser.save();
    } catch(error) {
        console.error('Error adding user in servies:', error);
        throw error;
    }
    return 0; //everything good
}

const addMoney = async (username, moneyAmountToAdd) => {
    try {
        const user = await userSchema.findOneAndUpdate(
          { username: username },
          { $inc: { moneyAmount: moneyAmountToAdd } }, // Increment the moneyAmount field by moneyAmountToAdd
          { new: true }
        );
        return user;
      } catch (error) {
        console.error('Error adding money to user:', error);
        throw error;
      }
}

module.exports = {
    getAllUsers, validateUser, addUser, addMoney
  }