var express = require('express');
var router = express.Router();
var client = require('../postgres.js');
var currentClient = client.getClient();
var passwordHash = require('password-hash');

//GET login page
router.get('/', function(req, res, next) {
	res.render('login');
	//res.render('login.ejs', { error: '' });
});

//Check if email and password exists, and redirect to newsfeed
router.post('/signIn', function(req, res, next) {
	//Construct query
	const query = {
		text: 'SELECT * FROM users WHERE email = $1',
		values: [req.body.loginEmail]
	}

	//Query if user email and password exists
	currentClient.query(query, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			//Verify hashed password matches
			if(passwordHash.verify(req.body.loginPassword, result.rows[0].pass))
			{
				//Sets a cookie with the users info
				req.session.user = result.rows[0];
				res.redirect('../newsfeed/'+result.rows[0].id);
			} else {
				console.log('PASSWORD DOES NOT MATCH');
				res.redirect('/');
			}
		}
	});
});

//Register user, and redirect to newsfeed
router.post('/reg', function(req, res) {
	//Hash password
	var hashedPassword = passwordHash.generate(req.body.password);

	//Query to prevent registering email twice
	const query1 = {
		text: 'SELECT * FROM users WHERE email = $1',
		values: [req.body.email]
	}
	currentClient.query(query1, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			if(result.rows.length > 0)
			{
				console.log('EMAIL EXISTS ALREADY');
				res.redirect('/');
			} else {
				//Register new user
				const query2 = {
					text: 'INSERT INTO users(first_name, last_name, email, pass, gender) VALUES($1, $2, $3, $4, $5) RETURNING *',
					values: [req.body.firstName, req.body.lastName, req.body.email, hashedPassword, req.body.gender]
				}
				currentClient.query(query2, (err, result)=> {
					if (err) {
						console.log(err);
					} else {
						//Sets a cookie with the users info
						req.session.user = result.rows[0];
						res.redirect('../newsfeed/'+result.rows[0].id);
					}
				});
			}
		}
	});
});

module.exports = router;