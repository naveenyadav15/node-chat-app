const users = [];

const addUser = ({
    id,
    username,
    room
}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    })
    if (existingUser) {
        return {
            error: "Username already taken!"
        }
    }

    const user = {
        id,
        username,
        room
    };
    users.push(user);
    return {
        user
    }
}


const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

    // return {
    //     error: "User does not exist!",
    // }
}

const getUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users[index];
    }

    // return {
    //     error: "User does not exist!",
    // }
}

const getUsersInRoom = (room) => users.filter((user) => user.room === room)

// addUser({
//     id: 12,
//     username: 'naveen',
//     room: '01'
// })
// const user1 = addUser({
//     id: 14,
//     username: 'naveen yadav',
//     room: '01'
// })
// const user2 = addUser({
//     id: 15,
//     username: 'naveen yadav',
//     room: '03'
// })

// console.log(users);
// console.log(getUser(1));

// // console.log(removeUser(12));
// // console.log(getUsersInRoom('01'));

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
}