var express = require('express');
var router = express.Router();
var AuthService = require('../services/auth');

router.get('/', homeController);
router.get('/me', AuthService.verify, meController);

function homeController(req, res) {
    res.json({success: true});
}

function meController(req, res) {
    res.json({success: true, user: req.decoded});
}

module.exports = router;