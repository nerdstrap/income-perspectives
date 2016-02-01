'use strict';

module.exports = {
	//db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-prod',
	//db: 'mongodb://heroku_6w5tbb8v:j1rjbvfnfpqav90kc3qaj3aicf@ds033125.mongolab.com:33125/heroku_6w5tbb8v',
	db: 'mongodb://nerdstrap:jock9560@ds056288.mongolab.com:56288/mean-prod',
	/**
	 * Database options that will be passed directly to mongoose.connect
	 * Below are some examples.
	 * See http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options
	 * and http://mongoosejs.com/docs/connections.html for more information
	 */
	dbOptions: {
		/*
		 server: {
		 socketOptions: {
		 keepAlive: 1
		 },
		 poolSize: 5
		 },
		 replset: {
		 rs_name: 'myReplicaSet',
		 poolSize: 5
		 },
		 db: {
		 w: 1,
		 numberOfRetries: 2
		 }
		 */
	},
	hostname: 'http://ip-dc-max.herokuapp.com/',
	app: {
		name: 'Income Perspectives dcMax'
	},
	logging: {
		format: 'combined'
	},
	strategies: {
		local: {
			enabled: true
		},
		landingPage: '/',
		facebook: {
			clientID: 'APP_ID',
			clientSecret: 'APP_SECRET',
			callbackURL: 'http://ip-dc-max.herokuapp.com//api/auth/facebook/callback',
			enabled: false
		},
		twitter: {
			clientID: 'CONSUMER_KEY',
			clientSecret: 'CONSUMER_SECRET',
			callbackURL: 'http://ip-dc-max.herokuapp.com//api/auth/twitter/callback',
			enabled: false
		},
		github: {
			clientID: 'APP_ID',
			clientSecret: 'APP_SECRET',
			callbackURL: 'http://ip-dc-max.herokuapp.com//api/auth/github/callback',
			enabled: false
		},
		google: {
			clientID: 'APP_ID',
			clientSecret: 'APP_SECRET',
			callbackURL: 'http://ip-dc-max.herokuapp.com//api/auth/google/callback',
			enabled: false
		},
		linkedin: {
			clientID: 'API_KEY',
			clientSecret: 'SECRET_KEY',
			callbackURL: 'http://ip-dc-max.herokuapp.com/api/auth/linkedin/callback',
			enabled: false
		}
	},
	emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
	mailer: {
		service: 'SERVICE_PROVIDER',
		auth: {
			user: 'EMAIL_ID',
			pass: 'PASSWORD'
		}
	},
	secret: 'J0ck$trap'
};
