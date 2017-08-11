var instance;

module.exports = {
	getInstance: function() {
        return instance;
    },
	setup: function(server) {
		instance  = require('socket.io')(server);

		instance.on('connection', function(socket){
            console.log('a user connected to sockets');   
            socket
            .on('newsfeed id', function(id) {
                console.log('NEWSFEED ID');
                socket.join(id);
            })
            .on('send post', function(data, id) {
                socket.broadcast.to(id).emit('new post', data);
            })
            .on('disconnect', function(){
                console.log('user disconnected');
            });
        });
	}
};