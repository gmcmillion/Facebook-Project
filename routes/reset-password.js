var express = require('express');
var router = express.Router();
var client = require('../postgres.js');
var currentClient = client.getClient();
var passwordHash = require('password-hash');

// GET reset-password page
router.get('/', function(req, res, next) {
	res.render('reset-password');
});

//Find user to reset password, and render next page
router.post('/reset', function(req, res) {
    //Query to find user
	const query1 = {
		text: 'SELECT * FROM users WHERE email = $1',
		values: [req.body.email]
	}
	currentClient.query(query1, (err, result)=> {
		if (err) {
			console.log(err);
		} else {
			if(result.rows.length === 0) {
				console.log('USER DOESNT EXIST');
				res.redirect('/');
			} else {
                console.log('FOUND USER, RENDERING NEXT PAGE');
                var hashedEmail = passwordHash.generate(result.rows[0].email);
                //Redirect to next page
                res.render('reset-password2.ejs', {id: result.rows[0].id, email: hashedEmail});
            }
		}
    });
});

//Render next page
router.post('/:uid/:email', function(req, res) {
    res.render('reset-password3.ejs', {id: req.params.uid});
});

//Reset
router.post('/:uid/reset-password/confirm', function(req, res) { 
    //Make sure both password entries are the same
    if(req.body.password !== req.body.passwordConfirm) {
        console.log('PASSWORDS ARE NOT THE SAME, TRY AGAIN');
        res.redirect('/');
    } else {
        //Hash new password
        var hashedPassword = passwordHash.generate(req.body.password);

        //Store in db
        const query = {
            text: 'UPDATE users SET pass = $1 WHERE id = $2',
            values: [hashedPassword, req.params.uid]
        }	
        //Run query
        currentClient.query(query, (err, result)=> {
            if (err) {
                console.log(err);
            } else {
                console.log('PASSWORD RESET');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;