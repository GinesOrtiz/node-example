module.exports = function(server) {
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        console.log('new connection');

        require('./sockets/game')(io, socket);
    });
    
    return io;
};