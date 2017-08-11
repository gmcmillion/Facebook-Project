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
                socket.join(id);        //Join room
            })
            .on('send post', function(data, id) {
                socket.broadcast.emit('new post', data);
            })
            .on('delete post', function(data, row) {
                socket.broadcast.emit('updated post', data, row);
            })
            .on('edit post', function(data, calc, row) {
                socket.broadcast.emit('edited post', data, calc, row);
            })
            .on('liked post', function(data, calc, row) {
                socket.broadcast.emit('update likes', data, calc, row);
            })
            .on('comment', function(data, calc, row) {
                socket.broadcast.emit('update comment', data, calc, row);
            })
            .on('disconnect', function(){
                console.log('user disconnected');
            });
        });
	}
};