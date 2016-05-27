var bodyParser = require('body-parser');
var home = require('./routes/home');
var auth = require('./routes/auth');
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var server = app.listen(process.env.PORT || 3000, info);

// App config
mongoose.connect(process.env.MONGO || 'mongodb://localhost/billy');
app.use(bodyParser.urlencoded({extended: false}));
require('./socket')(server);

// Routes
app.use(home);
app.use(auth);

// Info server
function info() {
    console.log('Server started at port: ' + (process.env.PORT || 3000));
}