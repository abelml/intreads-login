var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (id, done) {
	User.Local.find(id).then(function (user) {
		done(null, user);
	}).catch(function (err) {
		done(err);
	});
});

passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, username, password, done) {

		// User.Local.find wont fire unless data is sent back
		process.nextTick(function () {
			var params = {where: {'username': username}};
			User.Local.find(params).then(function (user) {
				if (user) {		// check if there is a user with that email
					return done(null, false, req.flash('signupMessage', 'Username is already taken.'));
				} else {
					User.Local.create({
						username: username,
						password: User.Local.generateHash(password)
					}).then(function (user) {
						console.log('User created: ' + username);
						return done(null, user);
					});
				}
			}).catch(function (error) {
				console.log('Error: ' + error);
				return done(error);
			});
		});
	}
));
    
passport.use('local-login',
	new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, username, password, done) {
		var params = {where: {"username": username}};
		User.Local.find(params).then(function (user) {
			if (!user) {
				return done(null, false, req.flash('loginMessage', 'No user found.'));
			}
			if (!user.isValidPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Wrong password.'));
			}
			return done(null, user);	// logged on
		}).catch(function (error) {
			console.log('Error! ' + error);
			return done(error);
		});
	}
));    

module.exports = passport;
