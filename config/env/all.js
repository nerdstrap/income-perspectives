'use strict';

var path = require('path'),
	rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	http: {
		port: process.env.PORT || 3000
	},
	https: {
		port: false,

		// Paths to key and cert as string
		ssl: {
			key: '',
			cert: ''
		}
	},
	hostname: process.env.HOST || process.env.HOSTNAME,
	db: process.env.MONGOHQ_URL,
	templateEngine: 'swig',

	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'j0cKstr@p',

	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',

	// The session cookie settings
	sessionCookie: {
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null
	},
	public: {
		languages: [{
			locale: 'en',
			direction: 'ltr'
		}, {
			locale: 'he',
			direction: 'rtl'
		}],
		currentLanguage: 'en',
		cssFramework: 'bootstrap'
	},
	// The session cookie name
	sessionName: 'connect.sid',
	// Set bodyParser options
	bodyParser: {
		json: {limit: '100kb'},
		urlencoded: {limit: '100kb', extended: true}
	},
	stripeOptions: {
		secretKey: process.env.STRIPE_KEY || 'sk_test_irbu4eJyKToXhQS3NIUo4b5p',
		publishableKey: process.env.STRIPE_PUB_KEY || 'pk_test_8HnHFMoMWN83e6LPHc3RFxLm',
		defaultPlan: 'individuals',
		plans: ['individuals', 'free'],
		planData: {
			'individuals': {
				name: 'Individuals',
				price: 39.99
			},
			'free': {
				name: 'Free',
				price: 0
			}
		}
	}

};
