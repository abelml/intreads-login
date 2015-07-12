var express = require('express');

var loginController = require('../controllers/loginController.js');

var router = express.Router();

router.get('/', loginController.index);
router.get('/login', loginController.login);
router.get('/signup', loginController.signup);
router.get('/profile', loginController.loggedIn, loginController.profile);
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

module.exports = router;
