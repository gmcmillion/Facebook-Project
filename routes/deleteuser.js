var express = require('express');
var router = express.Router();
var client = require('../postgres.js');
var currentClient = client.getClient();

//Render to delete user account
router.get('/:id', requireLogin, function(req, res, next) {
	var author = res.locals.user.first_name + ' ' + res.locals.user.last_name;	
	res.render('deleteuser', {id: res.locals.user.id, author: author, profilepic: res.locals.user.profilepic, title: 'Delete User'});
});

//To delete account
router.delete('/delete/:uid', function(req, res, next) {
	//Delete query
	const query = {
		text: 'DELETE FROM users WHERE id = $1',
		values: [req.params.uid]
	}	
	//Run query
	currentClient.query(query, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			//Also DELETE any posts associated with this user
			const query = {
				text: 'DELETE FROM posts WHERE authorid = $1',
				values: [req.params.uid]
			}	
			currentClient.query(query, (err, result)=> {
				if (err) {
					console.log(err);
				} else {
                    //Also DELETE any comments associated with this user
                    const query = {
                        text: 'DELETE FROM comments WHERE authorid = $1',
                        values: [req.params.uid]
                    }	
                    currentClient.query(query, (err, result)=> {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json(result);
                        }
                    });
                }
            });
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