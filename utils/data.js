var _ = require('lodash');
var bcrypt = require('bcrypt');

function compareModel(model, data) {
    var purged = {};

    _.forEach(model, function (value) {
        purged[value] = data[value];
    });

    return purged;
}

function createPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    compareModel: compareModel,
    createPassword: createPassword,
    comparePassword: comparePassword
};