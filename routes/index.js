var express = require('express');

var loginController = require('../controllers/loginController.js');

var router = express.Router();

router.get('/', loginController.index);
router.get('/login', loginController.login);
router.get('/signup', loginController.signup);
router.get('/profile', loginController.ensureAuthenticated, loginController.profile);
router.get('/logout', loginController.logout);

var pass = require('../config/passport.js');

router.post('/login',
	pass.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}),
	function (req, res) {
		console.log('Local login done!');
	}
);

router.post('/signup',
	pass.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}),
	function (req, res) {
		console.log('Local sign up done!');
	}
);

// Google routes

// send to google to do the authentication
// profile gets basic information (including name), and email the list of emails
router.get('/auth/google',
	pass.authenticate('google-oauth', {
		scope: ['profile', 'email']
	}),
	function (req, res) {
		console.log('Authenticating to Google...');
	}
);

// the callback after google has authenticated the user
router.get('/auth/google/callback',
	pass.authenticate('google-oauth', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}),
	function (req, res) {
		console.log('Google login done!');
	}
);


// route for twitter authentication and login
router.get('/auth/twitter', pass.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
router.get('/auth/twitter/callback',
	pass.authenticate('twitter', {
		successRedirect: '/profile',
		failureRedirect: '/'
	})
);

module.exports = router;
