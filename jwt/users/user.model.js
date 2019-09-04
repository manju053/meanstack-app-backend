const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const schema = new Schema({
    username: {type: String, unique: true, required: true},
    hash: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    createdDate: {type: Date, default: Date.now},
    role: {type: String, default: 'user'}
})

schema.set('toJSON', {virtual: true});

module.exports = mongoose.model('User', schema);