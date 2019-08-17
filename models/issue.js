

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let issue = new Schema({
    title: {
        type: String
    },
    responsible: {
        type: String
    },
    description: {
        type: String
    },
    severity: {
        type: String
    },
    status: {
        type: String,
        default: 'open'
    }
});

var Issue = mongoose.model('Issue', issue);
module.exports = Issue;
