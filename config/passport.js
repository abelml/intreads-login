var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var configAuth = require('./auth.js');
var User = require('../models/user.js');

// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	for (var service in User) {
		User[service].findById(id).then(function (user) {
			if (user) {
				done(null, user);
			}
		}).catch(function (err) {
			done(err);
		});
	}
});

passport.use('local-signup',
	new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, username, password, done) {

		// User.Local.find wont fire unless data is sent back
		process.nextTick(function () {
			var params = {where: {'username': username}};
			User.Local.findOne(params).then(function (user) {
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
				console.log('Local signup error: ' + error);
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
		var params = {where: {'username': username}};
		User.Local.findOne(params).then(function (user) {
			if (!user) {
				return done(null, false, req.flash('loginMessage', 'No user found.'));
			}
			if (!user.isValidPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Wrong password.'));
			}
			return done(null, user);	// logged on
		}).catch(function (error) {
			console.log('Local login error: ' + error);
			return done(error);
		});
	}
));    

passport.use('google-oauth',
	new GoogleStrategy({
		clientID: configAuth.googleAuth.clientID,
		clientSecret: configAuth.googleAuth.clientSecret,
		callbackURL: configAuth.googleAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {

		// User.Google.find won't fire until we have all our data back from Google
		process.nextTick(function () {
			// try to find the user based on their google id
			var params = {'id': profile.id};
			User.Google.findOne(params).then(function (user) {
				if (user) {
					return done(null, user);	// if a user is found, log them in
				}
				// if the user isn't in the database, create a new user
				User.Google.create({
					id: profile.id,
					token: token,
					name: profile.displayName,
					email: profile.emails[0].value	// pull the first email
				}).then(function (user) {
					console.log('Google user created: ' + profile.displayName);
					return done(null, user);
				});
			}).catch(function (error) {
				console.log('Google Oauth error: ' + error);
				return done(error);
			});
		});
	}
));

passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['displayName', 'emails']
	},
	function (token, refreshToken, profile, done) {

		process.nextTick(function () {
			var params = {'id': profile.id};
			User.Facebook.findOne(params).then(function (user) {

				if (user) {
					return done(null, user);
				}
				var email = profile.emails ? profile.emails[0].value : null;

				// set all of the facebook information in our user model
				User.Facebook.create({
					id: profile.id,
					token: token,
					name: profile.displayName,
					email: email
				}).then(function (user) {
					console.log('Facebook user created: ' + profile.name.givenName);
					return done(null, user);
				});
			}).catch(function (error) {
				console.log('Facebook Oauth error: ' + error);
				return done(error);
			});
		});
	}
));

module.exports = passport;
