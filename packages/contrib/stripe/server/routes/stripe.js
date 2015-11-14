'use strict';

//var StripeWebhook = require('stripe-webhook-middleware');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var StripeCustomer = mongoose.model('StripeCustomer');

/* jshint -W098 */
// The Package is passed automatically as first parameter
module.exports = function (Stripe, app, auth, database) {

	//var stripeWebhook = new StripeWebhook({
	//	stripeApiKey: Stripe.config.clean.stripeOptions.secretKey,
	//	respond: true
	//});

	//var stripeEvents = require('../middleware/stripeEvents')(Stripe);

	app.get('/api/stripe/admin/settings', auth.requiresLogin, function (req, res, next) {
		Stripe.settings(function (error, config) {
			if (error) {
				return res.send(500, error);
			}
			if (req.user.isAdmin()) {
				return res.json(200, config ? config.settings : {});
			}
			res.json(200, config ? {publicKey: config.settings.publicKey} : {});
		});
	});

	app.post('/api/stripe/admin/settings', auth.requiresAdmin, function (req, res, next) {
		Stripe.settings(req.body, function (error, config) {
			if (error) {
				return res.send(500, error);
			}
			if (req.user.isAdmin()) {
				return res.json(200, config ? config.settings : {});
			}
			res.json(200, config ? {publicKey: config.settings.publicKey} : {});
			Stripe.createClient();
		});
	});

	//app.put('/api/stripe/admin/settings', auth.requiresAdmin, function (req, res) {
	//	var updatedConfig = req.body;
	//	Stripe.settings(function (error, config) {
	//		if (error) {
	//			return res.send(500, error);
	//		}
	//
	//		var settings = {};
	//		if (config && config.settings) {
	//			settings = config.settings;
	//		}
	//		for (var index in updatedConfig) {
	//			if (updatedConfig.hasOwnProperty(index)) {
	//				settings[index] = updatedConfig[index];
	//			}
	//		}
	//
	//		Stripe.settings(settings, function (error, savedConfig) {
	//			if (error) {
	//				return res.send(500, error);
	//			}
	//			if (req.user.isAdmin()) {
	//				return res.json(200, savedConfig ? savedConfig.settings : {});
	//			}
	//			res.json(200, savedConfig ? {publicKey: savedConfig.settings.publicKey} : {});
	//			Stripe.createClient();
	//		});
	//	});
	//});

	//app.get('/api/stripe/admin/customers', auth.requiresAdmin, function (req, res, next) {
	//	Stripe.client.customers.list({
	//		limit: req.query.limit || 10
	//	}, function (error, customers) {
	//		if (error) {
	//			return res.send(500, error);
	//		}
	//		res.json(customers);
	//	});
	//});

	//app.get('/api/stripe/plans', auth.requiresLogin, function (req, res) {
	//	Stripe.client.plans.list(function (error, plans) {
	//		if (error) {
	//			return res.send(500, error);
	//		}
	//		res.jsonp(plans.data);
	//	});
	//});

	app.get('/api/stripe/customer', auth.requiresLogin, function (req, res, next) {

		StripeCustomer.findByUserId(req.user._id, function (error, stripeCustomer) {
			if (error) {
				return res.send(500, error);
			}

			if (!stripeCustomer) {
				return res.send(200);
			}

			return res.json(stripeCustomer);
		});
	});

	app.post('/api/stripe/customer', auth.requiresLogin, function (req, res, next) {

		User.findOne({
			_id: req.user._id
		}, function (error, user) {
			if (error || !user) {
				return res.send(500, error);
			}

			var cardHandler = function (error, customer) {
				console.log('Stripe.client.customers.create: ' + JSON.stringify(customer));
				if (error) {
					return res.send(500, error);
				}

				var card = customer.sources.data[0];
				var stripeCustomerData = {
					_user: user._id,
					customerId: customer.id,
					last4: card.last4
				};
				var stripeCustomer = new StripeCustomer(stripeCustomerData);

				stripeCustomer.save(function (error) {
					if (error) {
						return res.send(500, error);
					}
					return res.json(200, stripeCustomer);
				});
			};

			var tokenId = req.body.token.id;
			var email = user.email;

			Stripe.client.customers.create({
				email: email,
				source: tokenId
			}, cardHandler);
		});

	});

	app.delete('/api/stripe/customer', auth.requiresLogin, function (req, res, next) {
		var _id = req.user._id;

		StripeCustomer.findByUserId(_id, function (error, stripeCustomer) {
			if (error) {
				return res.send(500, error);
			}
			if (!stripeCustomer) {
				return res.send(404);
			}

			var customerHandler = function (error, customer) {
				if (error) {
					return res.send(500, error);
				}

				stripeCustomer.remove(function (error) {
					if (error) {
						return res.send(500, error);
					}

					return res.json(200);
				});
			};

			Stripe.client.customers.del(
				stripeCustomer.customerId,
				customerHandler
			);
		});

	});

	app.post('/api/stripe/subscription', auth.requiresLogin, function (req, res, next) {
		var planId = req.body.planId;
		var _id = req.user._id;

		StripeCustomer.findByUserId(_id, function (error, stripeCustomer) {
			if (error) {
				return res.send(500, error);
			}
			if (!stripeCustomer) {
				return res.send(404);
			}

			var subscriptionHandler = function (error, subscription) {
				console.log('Stripe.client.customers.createSubscription: ' + JSON.stringify(subscription));
				if (error) {
					return res.send(500, error);
				}

				stripeCustomer.plan = planId;
				stripeCustomer.subscriptionId = subscription.id;
				stripeCustomer.save(function (error) {
					if (error) {
						return res.send(500, error);
					}

					return res.json(200, stripeCustomer);
				});
			};

			Stripe.client.customers.createSubscription(
				stripeCustomer.customerId,
				{
					plan: planId
				},
				subscriptionHandler
			);
		});

	});

	//app.post('api/stripe/events',
	//	stripeWebhook.middleware,
	//	stripeEvents.stripeEvent
	//);
};
