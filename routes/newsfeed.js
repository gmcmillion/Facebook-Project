var express = require('express');
var router = express.Router();
var client = require('../postgres.js');
var currentClient = client.getClient();

// GET newsfeed page (DELETE SOON, UNNECESSARY)
router.get('/', function(req, res, next) {
	res.render('newsfeed');
});

// GET newsfeed page w/ id
router.get('/:id', function(req, res, next) {
	//Query for firstname, lastname
	const query = {
		text: 'SELECT * FROM users WHERE id = $1',
		values: [req.params.id]
	}	
	//Run query storing relevant info in newsfeed.ejs page
	currentClient.query(query, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			var author = result.rows[0].first_name + ' ' + result.rows[0].last_name;
			res.render('newsfeed', {id: req.params.id, author: author});
		}
	});
});

// GET all posts stored in database
router.get('/:id/posts', function(req, res, next) {
	console.log('GETTING POSTS');
	//Query to get all posts from current user
	//TODO: get posts only from this user, and implement a relation
	const query = {
		text: 'SELECT * FROM posts ORDER BY id'
	}	
	//Run query storing relevant info in newsfeed.ejs page
	currentClient.query(query, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			res.json(result.rows);
		}
	});
});

// POST to newsfeed
router.post('/:id', function(req, res, next) {
	//If Table doesnt exist, create 'posts' table
	currentClient.query('CREATE TABLE IF NOT EXISTS posts(id SERIAL PRIMARY KEY, author VARCHAR(100), profilepic VARCHAR(100), content VARCHAR(50), timestamp VARCHAR(50), liked BOOLEAN DEFAULT FALSE, commentsid VARCHAR(100))');

	//Insert data into table
	var userQuery = 'INSERT INTO posts(author, content, timestamp) VALUES($1, $2, $3) RETURNING *'
	var values = [req.body.author, req.body.content, req.body.time];
	currentClient.query(userQuery, values, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.json(result.rows[0]);
		}
	});
});

// PATCH for edit post content 
router.patch('/:pid/editpost', function(req, res) {	
	//Update query
	const query = {
		text: 'UPDATE posts SET content = $1 WHERE id = $2',
		values: [req.body.edit, req.params.pid]
	}	
	//Run query
	currentClient.query(query, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			res.json(result);
		}
	});
});

// PATCH for liking a post 
router.patch('/:pid/editlike', function(req, res) {	
	//Update query
	const query = {
		text: 'UPDATE posts SET liked = $1 WHERE id = $2',
		values: [req.body.like, req.params.pid]
	}	
	//Run query
	currentClient.query(query, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			console.log('liked');
			res.json(result);
		}
	});
});

// DELETE posts from newsfeed
router.delete('/:uid/deletePost/:pid', function(req, res) {
	//Delete query
	const query = {
		text: 'DELETE FROM posts WHERE id = $1',
		values: [req.params.pid]
	}	
	//Run query
	currentClient.query(query, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			res.json(result);
		}
	});
});

module.exports = router;