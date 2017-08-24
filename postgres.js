var pg = require('pg');

//Get environment if testing
var environment = process.env.NODE_ENV;
var connectionString = 'postgres://localhost:5432/facebook';
if(environment === 'test') {
    connectionString = 'postgres://localhost:5432/facebooktest';        //Testing database
}

var currentClient = new function() {
    //Create a new instance of client
    var client = new pg.Client(connectionString);	

    //Establish connection with client
    this.connect = function() {
        client.connect((err)=> {
            if(!err){
                console.log('CLIENT CONNECTED TO: '+ connectionString);
                //Run query with client to create tables
                client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50), email VARCHAR(100), pass VARCHAR(100), gender VARCHAR(6), profilepic VARCHAR(100))');
                client.query('CREATE TABLE IF NOT EXISTS posts(id SERIAL PRIMARY KEY, author VARCHAR(100), authorid VARCHAR(100), profilepic VARCHAR(100), content VARCHAR(50), timestamp VARCHAR(50), liked BOOLEAN DEFAULT FALSE)');
                client.query('CREATE TABLE IF NOT EXISTS comments(commentid SERIAL PRIMARY KEY, postid VARCHAR(50), author VARCHAR(100), authorid VARCHAR(100), profilepic VARCHAR(100), comment VARCHAR(200), timestamp VARCHAR(50))');
                client.query('CREATE TABLE IF NOT EXISTS friendships(firstfriendid VARCHAR(50), secondfriendid VARCHAR(50))');
            }
        });
    }
    //Get client
    this.getClient = function() {
        return client;
    }

    //Wipe database for testing
    this.truncate = function() {
        client.query('TRUNCATE users, posts, comments');
    }

    //Logout
    this.logout = function() {
        client.end();
    }
}

module.exports = currentClient;