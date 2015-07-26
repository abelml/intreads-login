var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var configAuth = require('./auth.js');
var User = require('../models/user.js');


// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

passport.serializeUser(function (user, done) {
	var service, userId;
	for (field in user) {
		service = field;
		userId = user[field].id;
	}
	done(null, {service: service, id: userId});
});

passport.deserializeUser(function (data, done) {
	var myUser = {};
	var service = data.service.charAt(0).toUpperCase() + data.service.slice(1);
	User[service].findById(data.id).then(function (user) {
		if (user) {
			myUser[data.service] = user;
			done(null, myUser);
		}
	}).catch(function (err) {
		done(err);
	});
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
						return done(null, {local: user});
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
			return done(null, {local: user});	// logged on
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
			User.Google.findById(profile.id).then(function (user) {
				if (user) {
					return done(null, {google: user});	// if a user is found, log them in
				}

				// if the user isn't in the database, create a new one
				User.Google.create({
					id: profile.id,
					token: token,
					name: profile.displayName,
					email: profile.emails[0].value	// pull the first email
				}).then(function (user) {
					console.log('Google user created: ' + profile.displayName);
					return done(null, {google: user});
				});
			}).catch(function (error) {
				console.log('Google Oauth error: ' + error);
				return done(error);
			});
		});
	}
));

passport.use('twitter',
	new TwitterStrategy({
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret,
		callbackURL: configAuth.twitterAuth.callbackURL
	},
	function (token, tokenSecret, profile, done) {

		process.nextTick(function () {
			User.Twitter.findById(profile.id).then(function (user) {
				if (user) {
					return done(null, {twitter: user});
				}
				User.Twitter.create({
					id: profile.id,
					token: token,
					username: profile.username,
					displayName: profile.displayName
				}).then(function (user) {
					console.log('Twitter user created: ' + profile.displayName);
					return done(null, {twitter: user});
				});
			}).catch(function (error) {
				console.log('Twitter Oauth error: ' + error);
			});
		});
	}
));

passport.use('facebook',
	new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['displayName', 'emails']
	},
	function (token, refreshToken, profile, done) {

		process.nextTick(function () {

			User.Facebook.findById(profile.id).then(function (user) {
				if (user) {
					return done(null, {facebook: user});
				}
				User.Facebook.create({
					id: profile.id,
					token: token,
					name: profile.displayName,
					email: profile.emails ? profile.emails[0].value : null
				}).then(function (user) {
					console.log('Facebook user created: ' + profile.name.givenName);
					return done(null, {facebook: user});
				});
			}).catch(function (error) {
				console.log('Facebook Oauth error: ' + error);
				return done(error);
			});
		});
	}
));

module.exports = passport;
