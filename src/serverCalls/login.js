//Some default users for Adarrrrrr
export const userList = [{"username": "1", "password": "1", "email": "1@1.com"},
                         {"username": "2", "password": "2", "email": "2@2.com"},
                         {"username": "3", "password": "3", "email": "3@3.com"}];

export async function userExistsWithPassword(username, password) {
    const data = {"username" : username, "password" : password};
    const res = await fetch('http://localhost:8080/validateUser', {
      'method' : 'post',
      "headers" : {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify(data)
    });
    let user = await res.json();
    let status = res.status;
    return [user, status];
}

export async function GetAllUser(){
    const res = await fetch('http://localhost:8080/users', {
        'method' : 'get',
        "headers" : {
          'Content-Type': 'application/json',
        },
      });
      let users = await res.json();
      //returning the status number and ID!!
      return users;
}
