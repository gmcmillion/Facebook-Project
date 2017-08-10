var express = require('express');
var router = express.Router();
var client = require('../postgres.js');
var currentClient = client.getClient();

// GET newsfeed page w/ id
router.get('/:id', requireLogin, function(req, res, next) {
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

// GET user stored in database if they exist
router.get('/:email/findfriend', function(req, res, next) {
	//Query for user email
	const query = {
		text: 'SELECT * FROM users WHERE email = $1',
		values: [req.params.email]
	}	
	//Run query
	currentClient.query(query, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			res.json(result.rows);
		}
	});
});

// GET all posts stored in database
router.get('/:id/posts', function(req, res, next) {
	//If Table doesnt exist, create 'posts' table
	currentClient.query('CREATE TABLE IF NOT EXISTS posts(id SERIAL PRIMARY KEY, author VARCHAR(100), profilepic VARCHAR(100), content VARCHAR(50), timestamp VARCHAR(50), liked BOOLEAN DEFAULT FALSE)');

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

// GET all comments for a specific post
router.get('/:pid/allcomments', function(req, res, next) {
	//If Table doesnt exist, create 'posts' table
	currentClient.query('CREATE TABLE IF NOT EXISTS comments(commentid SERIAL PRIMARY KEY, postid VARCHAR(50), author VARCHAR(100), profilepic VARCHAR(100), comment VARCHAR(200))');

	//Query to get all comments from current post
	const query = {
		text: 'SELECT * FROM comments WHERE postid = $1', 
		values: [req.params.pid]
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

// POST comments
router.post('/:pid/comment', function(req, res, next) {
	//Create comment table if it doesnt exist
	currentClient.query('CREATE TABLE IF NOT EXISTS comments(commentid SERIAL PRIMARY KEY, postid VARCHAR(50), author VARCHAR(100), profilepic VARCHAR(100), comment VARCHAR(200))');
	//Insert data into table
	const query = 'INSERT INTO comments(postid, author, comment) VALUES($1, $2, $3) RETURNING *'
	const values = [req.params.pid, req.body.author, req.body.newComment];
	currentClient.query(query, values, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.json(result.rows[0]);
		}
	});
});

// POST to add a friend
router.post('/:uid/addfriend', function(req, res, next) {
	//Create friendship table if it doesnt exist
	currentClient.query('CREATE TABLE IF NOT EXISTS friendships(firstfriendid VARCHAR(50), secondfriendid VARCHAR(50))');

	//Query to add user id's to friendship table
	const query = {
		text: 'INSERT INTO friendships(firstfriendid, secondfriendid) VALUES($1, $2) RETURNING *', 
		values: [req.body.myid, req.params.uid]
	}	
	//Run query
	currentClient.query(query, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			res.json(result.rows[0]);
		}
	});
});

//Check if user is logged in, otherwise redirect to login page
function requireLogin (req, res, next) {
	if (!req.user) {
		//res.render('login.ejs', { error: 'Must be logged in to view this page' });
		res.redirect('/');
	} else {
		next();
	}
};

module.exports = router;