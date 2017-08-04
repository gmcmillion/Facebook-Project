var express = require('express');
var router = express.Router();
var client = require('../postgres.js');
var currentClient = client.getClient();
var passwordHash = require('password-hash');

//GET login page
router.get('/', function(req, res, next) {
	res.render('login');
});

//Check if email and password exists, and redirect to newsfeed
router.post('/signIn', function(req, res, next) {
	console.log(req.body);

	//Construct query
	const query = {
		text: 'SELECT * FROM users WHERE email = $1 AND pass = $2',
		values: [req.body.loginEmail, req.body.loginPassword]
	}
	/*
	const query = {
		text: 'SELECT * FROM users WHERE email = $1',
		values: [req.body.loginEmail]
	}
	*/
	
	//Query if user email and password exists
	currentClient.query(query, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			console.log(result.rows[0]);
			// var hash = result.rows[0].pass;
			// console.log(passwordHash.verify('hello', hash));
			//Verify hashed password matches
			// if(passwordHash.verify(req.body.loginPassword, result.rows[0].pass))
			// {
			// 	console.log('matches');
			// 	res.redirect('../newsfeed/'+result.rows[0].id);
			// } else {
			// 	console.log('password doesnt match');
			// }
			res.redirect('../newsfeed/'+result.rows[0].id);
		}
	});
});

//Register user, and redirect to newsfeed
router.post('/reg', function(req, res) {
	//Hash password
	var hashedPassword = passwordHash.generate('req.body.password');
	
	var userQuery = 'INSERT INTO users(first_name, last_name, email, pass, gender) VALUES($1, $2, $3, $4, $5) RETURNING *'
	var values = [req.body.firstName, req.body.lastName, req.body.email, hashedPassword, req.body.gender];
	currentClient.query(userQuery, values, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log('id: '+result.rows[0].id);
			res.redirect('../newsfeed/'+result.rows[0].id);
		}
	});
});

module.exports = router;