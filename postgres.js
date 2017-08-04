var pg = require('pg');
var connectionString = 'postgres://localhost:5432/facebook';

var currentClient = new function() {
    //Create a new instance of client
    var client = new pg.Client(connectionString);	

    //Establish connection with client
    this.connect = function() {
        client.connect((err)=> {
            if(!err){
                console.log('CLIENT CONNECTED');
                //Run query with client to create users table
                client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50), email VARCHAR(100), pass VARCHAR(50), gender VARCHAR(6))');
            }
        });
    }
    //Get client
    this.getClient = function() {
        return client;
    }
    //Logout
    this.logout = function() {
        client.end();
    }
}

module.exports = currentClient;