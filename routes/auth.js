var express = require('express');
var router = express.Router();
var AuthService = require('../services/auth');

router.post('/login', loginController);
router.post('/signup', signUpController);

function loginController(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'invalid_params'});
    } else {
        AuthService.login({email: req.body.email, password: req.body.password}, function (response) {
            res.json(response);
        });
    }
}

function signUpController(req, res) {
    AuthService.signup(req.body, function (response) {
        res.json(response);
    });
}

module.exports = router;