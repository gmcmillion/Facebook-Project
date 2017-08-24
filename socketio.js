var instance;

module.exports = {
	getInstance: function() {
        return instance;
    },
	setup: function(server) {
        instance  = require('socket.io')(server);
        
        instance.on('connection', function(socket){ 
            console.log('USER IS CONNECTED');
            socket.on('disconnect', function(){
                console.log('USER IS DISCONNECTED');
            });
        });
	}
};