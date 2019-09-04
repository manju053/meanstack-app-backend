const config = require('../config');
const jwt = require('jsonwebtoken');
const db = require('../_helper/db');
const bcrypt = require('bcrypt');
const User = db.User;

module.exports = {authenticate, 
    getAll,
    create,
    update,
    getById,
    delete: _delete
    };

// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

// async function authenticate({username, password}) {
//     const user = users.find(u => u.username === username && u.password === password);
//     if(user) {
//         const token = jwt.sign({sub: user.id}, config.secret);
//         const {userPassword, ...userWithoutPassword} = user;
//         return {
//             ...userWithoutPassword,
//             token
//         };
//     }
   
// }

async function authenticate({username, password}) {
    const user = await User.findOne({username});
    if(user && bcrypt.compareSync(password, user.hash)) {
        const {hash, ...userWithoutHash} = user.toObject();
        const token = jwt.sign({sub: user.id}, config.secret);
        return {
            ...userWithoutHash,
            token
        }
    }
}

// async function getAll() {
//     return users.map(u => {
//         const {password, ...userWithoutPassword} = u;
//         return userWithoutPassword;
//     });
// }

async function getAll() {
   return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {

    //validate
    if(await User.findOne({username: userParam.username})) {
        throw 'Username "' + userParam.username + '"is already taken';
    }

    const user = new User(userParam);
    console.log('user:', user);
    //hash password

    if(userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    if(!user) {
        throw 'User not found';
    }

    if(user.username !== userParam.username && await User.findOne({username: userParam.username})) {
        throw 'Username "' + user.username + '"is already taken';
    }

    Object.assign(user, userParam);

    if(userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}
