var mongoose = require('mongoose');

var User = mongoose.model('User', {
    name: String,
    email: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
});

module.exports = {
    User: User
};