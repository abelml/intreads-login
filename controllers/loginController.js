// GET /
exports.index = function (req, res) {
	res.render('index.ejs');
};

// GET /login
exports.login = function (req, res) {
	res.render('login.ejs', {
		header: 'Login',
		message: req.flash('loginMessage'),
		url: '/login',
		link: 'Need an account? <a href="/signup">Sign up</a>'
	}); 
};

// GET /signup
exports.signup = function (req, res) {
	res.render('login.ejs', {
		header: 'Sign up',
		message: req.flash('signupMessage'),
		url: '/signup',
		link: 'Already have an account? <a href="/login">Login</a>'
	}); 
};

// route middleware to make sure a user is logged in
exports.loggedIn = function (req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated()) {
		return next();
	}

	// else redirect to home page
	res.redirect('/');
}

// GET /profile
exports.profile = function (req, res) {
	res.render('profile.ejs', {user : req.user});
};

// GET /logout
exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};
