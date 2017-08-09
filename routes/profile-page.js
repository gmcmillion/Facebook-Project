var express = require('express');
var router = express.Router();

// GET login page
router.get('/', requireLogin, function(req, res, next) {
	res.render('profile-page');
	//res.render('profile-page', {id: req.params.id, author: author});
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