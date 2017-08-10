var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');

//Routes
var login = require('./routes/login');
var newsfeed = require('./routes/newsfeed');
var profilePage = require('./routes/profile-page');

//Postgres
var client = require('./postgres.js');
client.connect();		//Establish connection with client
var currentClient = client.getClient();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Use SSL so app only communicates w/ browser over encrypted channel
app.use(sessions({
	cookieName: 'session',
	secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	httpOnly: true,   //prevents browser JS from accessing cookies
	secure: true,     //ensures cookies are only used over HTTPS
	ephemeral: true   //deletes the cookie when the browser is closed
}));

//Session middleware
app.use(function(req, res, next) {
	if (req.session && req.session.user) {
		//Query to get all comments from current post
		const query = {
			text: 'SELECT * FROM users WHERE email = $1', 
			values: [req.session.user.email]
		}	
		//Run query storing relevant info in newsfeed.ejs page
		currentClient.query(query, (err, result)=> {
			if (err) {
				console.log(err);
			} else {
				if(result.rows.length != 0) {
					req.user = result.rows[0];
					delete req.user.password; 			// delete the password from the session
					req.session.user = result.rows[0];  //refresh the session value
					res.locals.user = result.rows[0];
				}
			}
			// finishing processing the middleware and run the route
			next();
		});
	} else {
		next();
	}
});

//Reset session when user logs out
app.get('/logout', function(req, res) {
	//Reset the session
	req.session.reset();
	
	//Redirect to homepage
	res.redirect('/');
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', login);
app.use('/login', login);
app.use('/newsfeed', newsfeed);
app.use('/profile-page', profilePage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
