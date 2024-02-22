
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
