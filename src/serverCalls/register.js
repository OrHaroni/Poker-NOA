const serverIP = process.env.REACT_APP_SERVER_IP;
const serverPort = process.env.REACT_APP_SERVER_PORT;

const registerServer = async (user) => {
    const res = await fetch(`http://${serverIP}:${serverPort}/users/register`, {
        'method' : 'post',
        "headers" : {
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify(user)
      });

      return await res.status;
};

export default registerServer;
