var express = require('express');
var router = express.Router();
var client = require('../postgres.js');
var currentClient = client.getClient();
var io = require('../socketio');

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
			res.render('newsfeed', {id: result.rows[0].id, author: author, profilepic: result.rows[0].profilepic, title: 'Newsfeed'});
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
	//Query to get all posts from current user & our friends posts
	const query = {
		text: 'SELECT * FROM posts WHERE authorid = $1 OR authorid IN (SELECT secondfriendid FROM friendships WHERE firstfriendid = $1) ORDER BY timestamp',
		values: [req.params.id]
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
	var userQuery = 'INSERT INTO posts(author, authorid, content, timestamp, profilepic) VALUES($1, $2, $3, $4, $5) RETURNING *'
	var values = [req.body.author, req.params.id, req.body.content, req.body.time, req.body.profilepic];
	currentClient.query(userQuery, values, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			//io.getInstance()in(req.params.id).emit('new post', result.rows[0]);
			io.getInstance().emit('new post', result.rows[0]);
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
			io.getInstance().emit('edited post', req.params.pid, req.body.edit);
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
			io.getInstance().emit('update likes', req.params.pid, req.body.like);
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
			//Also DELETE any comments associated with this deleted post
			const query = {
				text: 'DELETE FROM comments WHERE postid = $1',
				values: [req.params.pid]
			}	
			currentClient.query(query, (err, result)=> {
				if (err) {
					console.log(err);
				} else {
					io.getInstance().emit('deleted post', req.params.pid);
					res.json(result);
				}
			});
		}
	});
});

// GET all comments for a specific post
router.get('/:pid/allcomments', function(req, res, next) {
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
	//Insert data into table
	const query = 'INSERT INTO comments(postid, author, authorid, comment, profilepic, timestamp) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
	const values = [req.params.pid, req.body.author, req.body.authorid, req.body.newComment, req.body.profilepic, req.body.timestamp];
	currentClient.query(query, values, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			io.getInstance().emit('update comment', result.rows[0]);
			res.json(result.rows[0]);
		}
	});
});

// POST to add a friend
router.post('/:uid/addfriend', function(req, res, next) {
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

// GET all users friends
router.get('/:uid/friends', function(req, res, next) {
	//Query to get all friends
	const query = {
		text: 'SELECT secondfriendid FROM friendships WHERE firstfriendid = $1', 
		values: [req.params.uid]
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

//Check if user is logged in, otherwise redirect to login page
function requireLogin (req, res, next) {
	if (!req.user) {
		res.redirect('/');
	} else {
		next();
	}
};

module.exports = router;