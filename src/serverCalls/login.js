//Some default users for Adarrrrrr
export const userList = [{"username": "1", "password": "1", "email": "1@1.com"},
                         {"username": "2", "password": "2", "email": "2@2.com"},
                         {"username": "3", "password": "3", "email": "3@3.com"}];

export function userExistsWithPassword(username, password) {
    return userList.some(obj => obj.username === username && obj.password === password);
}
