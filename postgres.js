var pg = require('pg');

//Get environment if testing
var environment = process.env.NODE_ENV;

var connectionString = 'postgres://localhost:5432/facebook';
if(environment === 'test') {
    connectionString = 'postgres://localhost:5432/facebook-test';
}

var currentClient = new function() {
    //Create a new instance of client
    var client = new pg.Client(connectionString);	

    //Establish connection with client
    this.connect = function() {
        client.connect((err)=> {
            if(!err){
                console.log('CLIENT CONNECTED TO: '+ connectionString);
                //Run query with client to create users table
                client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50), email VARCHAR(100), pass VARCHAR(100), gender VARCHAR(6), profilepic VARCHAR(100))');
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