var port = process.env.PORT || 8080;
var baseUrl = process.env.BASE_URL || 'http://localhost:' + port + '/auth/';
console.log('Base URL: ' + baseUrl);

module.exports = {

	facebookAuth: {
		clientID: '150079248657254',
		clientSecret: 'c840f5290342edb51177e0ec921c5da4',
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
