module.exports = function (io, socket) {
    socket.on('requestMove', function (key) {
        console.log('requested: ' + key);
        io.emit('move', key);
    });
};