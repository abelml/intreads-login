var port = process.env.PORT || 8080;
var baseUrl = process.env.BASE_URL || 'http://localhost:' + port + '/auth/';
console.log('Base URL: ' + baseUrl);

module.exports = {

	facebookAuth: {
		clientID: 'your-secret-clientID-here',
		clientSecret: 'your-client-secret-here',
		callbackURL: baseUrl + 'facebook/callback'
    },

	twitterAuth: {
		consumerKey: 'your-consumer-key-here',
		consumerSecret: 'your-client-secret-here',
		callbackURL: baseUrl + 'twitter/callback'
	},

	googleAuth: {
		clientID: '136223912423-8mdcnp6som2pbaknngba9f9qtrh35bic.apps.googleusercontent.com',
		clientSecret: 'YwLR9F7Rs1PEPiknNOezFjUf',
		callbackURL: baseUrl + 'google/callback'
	}

};
