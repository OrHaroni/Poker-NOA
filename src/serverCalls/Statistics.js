// export async func 'get' to get the array of players on the table
export async function getStat(username) {
    const res = await fetch('http://localhost:8080/users/getStat/' + username, {
      'method' : 'get',
      "headers" : {
        'Content-Type': 'application/json',
      },
    });
    let userStat = await res.json();
    let status = res.status;
    console.log("we got this: ", userStat);
    return [userStat, status];
}