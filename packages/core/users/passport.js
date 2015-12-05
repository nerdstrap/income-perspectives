'use strict';

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedinStrategy = require('passport-linkedin').Strategy;
var User = mongoose.model('User');
var config = require('ns-meanio').loadConfig();

module.exports = function (passport) {

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findOne({
			_id: id
		}, '-salt -hashed_password', function (err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		},
		function (email, password, done) {
			User.findOne({
				email: email
			}, function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Unknown user'
					});
				}
				if (!user.authenticate(password)) {
					return done(null, false, {
						message: 'Invalid password'
					});
				}
				return done(null, user);
			});
		}
	));

	passport.use(new TwitterStrategy({
			consumerKey: config.strategies.twitter.clientID,
			consumerSecret: config.strategies.twitter.clientSecret,
			callbackURL: config.strategies.twitter.callbackURL
		},
		function (token, tokenSecret, profile, done) {
			User.findOne({
				'twitter.id_str': profile.id
			}, function (err, user) {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(err, user);
				}
				user = new User({
					name: profile.displayName,
					username: profile.username,
					provider: 'twitter',
					twitter: profile._json,
					roles: ['authenticated']
				});
				user.save(function (err) {
					if (err) {
						console.log(err);
						return done(null, false, {message: 'Twitter login failed, email already used by other login strategy'});
					} else {
						return done(err, user);
					}
				});
			});
		}
	));

	passport.use(new FacebookStrategy({
			clientID: config.strategies.facebook.clientID,
			clientSecret: config.strategies.facebook.clientSecret,
			callbackURL: config.strategies.facebook.callbackURL
		},
		function (accessToken, refreshToken, profile, done) {
			User.findOne({
				'facebook.id': profile.id
			}, function (err, user) {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(err, user);
				}
				user = new User({
					name: profile.displayName,
					email: profile.emails[0].value,
					username: profile.username || profile.emails[0].value.split('@')[0],
					provider: 'facebook',
					facebook: profile._json,
					roles: ['authenticated']
				});
				user.save(function (err) {
					if (err) {
						console.log(err);
						return done(null, false, {message: 'Facebook login failed, email already used by other login strategy'});
					} else {
						return done(err, user);
					}
				});
			});
		}
	));

	passport.use(new GitHubStrategy({
			clientID: config.strategies.github.clientID,
			clientSecret: config.strategies.github.clientSecret,
			callbackURL: config.strategies.github.callbackURL
		},
		function (accessToken, refreshToken, profile, done) {
			User.findOne({
				'github.id': profile.id
			}, function (err, user) {
				if (user) {
					return done(err, user);
				}
				user = new User({
					name: profile._json.displayName || profile._json.login,
					username: profile._json.login,
					email: profile.emails[0].value,
					provider: 'github',
					github: profile._json,
					roles: ['authenticated']
				});
				user.save(function (err) {
					if (err) {
						console.log(err);
						return done(null, false, {message: 'Github login failed, email already used by other login strategy'});
					} else {
						return done(err, user);
					}
				});
			});
		}
	));

	passport.use(new GoogleStrategy({
			clientID: config.strategies.google.clientID,
			clientSecret: config.strategies.google.clientSecret,
			callbackURL: config.strategies.google.callbackURL
		},
		function (accessToken, refreshToken, profile, done) {
			User.findOne({
				'google.id': profile.id
			}, function (err, user) {
				if (user) {
					return done(err, user);
				}
				user = new User({
					name: profile.displayName,
					email: profile.emails[0].value,
					username: profile.emails[0].value,
					provider: 'google',
					google: profile._json,
					roles: ['authenticated']
				});
				user.save(function (err) {
					if (err) {
						console.log(err);
						return done(null, false, {message: 'Google login failed, email already used by other login strategy'});
					} else {
						return done(err, user);
					}
				});
			});
		}
	));

	// use linkedin strategy
	passport.use(new LinkedinStrategy({
			consumerKey: config.strategies.linkedin.clientID,
			consumerSecret: config.strategies.linkedin.clientSecret,
			callbackURL: config.strategies.linkedin.callbackURL,
			profileFields: ['id', 'first-name', 'last-name', 'email-address']
		},
		function (accessToken, refreshToken, profile, done) {
			User.findOne({
				'linkedin.id': profile.id
			}, function (err, user) {
				if (user) {
					return done(err, user);
				}
				user = new User({
					name: profile.displayName,
					email: profile.emails[0].value,
					username: profile.emails[0].value,
					provider: 'linkedin',
					linkedin: profile._json,
					roles: ['authenticated']
				});
				user.save(function (err) {
					if (err) {
						console.log(err);
						return done(null, false, {message: 'LinkedIn login failed, email already used by other login strategy'});
					} else {
						return done(err, user);
					}
				});
			});
		}
	));
	return passport;
};
