
const registerServer = async (user) => {
    const res = await fetch('http://localhost:8080/register', {
        'method' : 'post',
        "headers" : {
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify(user)
      });

      return await res.status;
};

export default registerServer;
