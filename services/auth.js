var Auth = require('../models/auth');
var utilsData = require('../utils/data');
var jwt = require('jsonwebtoken');

function verify(req, res, next) {
    if (req.headers['authorization']) {
        jwt.verify(req.headers['authorization'], process.env.SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).send({success: false, message: 'invalid_token'});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).send({
            success: false,
            message: 'token_required'
        });
    }
}

function login(credentials, cb) {
    Auth.User.findOne({email: credentials.email}, function (err, user) {
        if (!user) {
            cb({success: false, msg: 'user_not_found'});
        } else {
            if (utilsData.comparePassword(credentials.password, user.password)) {
                cb({success: true, token: jwt.sign({user: user}, process.env.SECRET)});
            } else {
                cb({success: false, msg: 'user_not_found'});
            }
        }
    });
}

function signup(credentials, cb) {
    var user = new Auth.User(credentials);
    user.password = utilsData.createPassword(user.password);

    user.save(function (err, user) {
        if (err) {
            cb(err);
        } else {
            user.password = null;
            cb({success: true, user: user});
        }
    });
}

module.exports = {
    login: login,
    signup: signup,
    verify: verify
};