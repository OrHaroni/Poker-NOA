
export async function getAllUsers() {
    const data = {};
    const res = await fetch('http://localhost:8080/users/getAll', {
      'method' : 'post',
      "headers" : {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify(data)
    });
    let AllUsers = await res.json();
    let status = res.status;
    return [AllUsers, status];
}