'use strict';

//var StripeWebhook = require('stripe-webhook-middleware');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Schema = mongoose.Schema;

/* jshint -W098 */
// The Package is passed automatically as first parameter
module.exports = function (Stripe, app, auth, database) {
	var StripeCustomerSchema = new Schema({
		userId: String,
		customerId: String,
		subscriptionId: String,
		last4: String,
		plan: String
	});
	mongoose.model('StripeCustomer', StripeCustomerSchema);
	var StripeCustomer = mongoose.model('StripeCustomer');

	//var stripeWebhook = new StripeWebhook({
	//	stripeApiKey: Stripe.config.clean.stripeOptions.secretKey,
	//	respond: true
	//});

	//var stripeEvents = require('../middleware/stripeEvents')(Stripe);

	app.get('/api/stripe/admin/settings', auth.requiresLogin, function (req, res, next) {
		Stripe.settings(function (err, config) {
			if (err) {
				return res.send(500, err);
			}
			if (req.user.isAdmin()) {
				return res.json(200, config ? config.settings : {});
			}
			res.json(200, config ? {publicKey: config.settings.publicKey} : {});
		});
	});

	app.post('/api/stripe/admin/settings', auth.requiresAdmin, function (req, res, next) {
		Stripe.settings(req.body, function (err, config) {
			if (err) {
				return res.send(500, err);
			}
			if (req.user.isAdmin()) {
				return res.json(200, config ? config.settings : {});
			}
			res.json(200, config ? {publicKey: config.settings.publicKey} : {});
			Stripe.createClient();
		});
	});

	app.put('/api/stripe/admin/settings', auth.requiresAdmin, function (req, res) {
		var updatedConfig = req.body;
		Stripe.settings(function (err, config) {
			if (err) {
				return res.send(500, err);
			}

			var settings = {};
			if (config && config.settings) {
				settings = config.settings;
			}
			for (var index in updatedConfig) {
				if (updatedConfig.hasOwnProperty(index)) {
					settings[index] = updatedConfig[index];
				}
			}

			Stripe.settings(settings, function (err, savedConfig) {
				if (err) {
					return res.send(500, err);
				}
				if (req.user.isAdmin()) {
					return res.json(200, savedConfig ? savedConfig.settings : {});
				}
				res.json(200, savedConfig ? {publicKey: savedConfig.settings.publicKey} : {});
				Stripe.createClient();
			});
		});
	});

	app.get('/api/stripe/admin/customers', auth.requiresAdmin, function (req, res, next) {
		Stripe.client.customers.list({
			limit: req.query.limit || 10
		}, function (err, customers) {
			if (err) {
				return res.send(500, err);
			}
			res.json(customers);
		});
	});

	app.get('/api/stripe/plans', auth.requiresLogin, function (req, res) {
		Stripe.client.plans.list(function (err, plans) {
			if (err) {
				return res.send(500, err);
			}
			res.jsonp(plans.data);
		});
	});

	app.get('/api/stripe/cards', auth.requiresLogin, function (req, res, next) {

		User.findOne({
			_id: req.user._id
		}, function (err, user) {
			if (err) {
				return res.send(500, err);
			}

			StripeCustomer.findOne({
				userId: req.user._id
			}, function (err, stripeCustomer) {
				if (err) {
					return res.send(500, err);
				}

				if (stripeCustomer) {
					Stripe.client.customers.listCards(stripeCustomer.customerId, {
						limit: req.query.limit || 10
					}, function (err, cards) {
						if (err) {
							return res.send(500, err);
						}
						var output = [];
						delete cards.url;
						if (cards.data && cards.data.length) {
							cards.data.forEach(function (card) {
								output.push({
									last4: card.last4,
									type: card.type,
									brand: card.brand,
									exp_month: card.exp_month,
									exp_year: card.exp_year
								});
							});
						}
						cards.data = output;
						res.json(cards);
					});
				}
				else {
					return res.send(200, {
						has_more: false,
						data: []
					});
				}
			});
		});
	});

	app.post('/api/stripe/cards', auth.requiresLogin, function (req, res, next) {

		User.findOne({
			_id: req.user._id
		}, function (err, user) {
			if (err) {
				return res.send(500, err);
			}

			var cardHandler = function (err, customer) {
				console.log('Stripe.client.customers.create: ' + JSON.stringify(customer));
				if (err) {
					return res.send(500, err);
				}

				var card = customer.sources.data[0];
				var stripeCustomerData = {
					userId: user._id,
					customerId: customer.id,
					subscriptionId: '',
					last4: card.last4,
					plan: ''
				};
				var stripeCustomer = new StripeCustomer(stripeCustomerData);

				stripeCustomer.save(function (err) {
					if (err) {
						return res.send(500, err);
					}
					return res.send(200);
				});
			};

			var tokenId = req.body.token.id;
			var email = req.user.email;

			Stripe.client.customers.create({
				email: email,
				source: tokenId
			}, cardHandler);
		});

	});

	app.post('/api/stripe/subscription', auth.requiresLogin, function (req, res, next) {
		var planId = req.body.planId;
		var _id = req.user._id;

		User.findOne({
			_id: _id
		}, function (err, user) {
			if (err) {
				return res.send(500, err);
			}

			StripeCustomer.findOne({
				userId: _id
			}, function (err, stripeCustomer) {
				if (err) {
					return res.send(500, err);
				}

				var subscriptionHandler = function (err, subscription) {
					console.log('Stripe.client.customers.createSubscription: ' + JSON.stringify(subscription));
					if (err) {
						return res.send(500, err);
					}

					stripeCustomer.plan = planId;
					stripeCustomer.subscriptionId = subscription.id;
					stripeCustomer.save(function (err) {
						if (err) {
							return res.send(500, err);
						}

						return res.send(200);
					});
				};


				Stripe.client.customers.createSubscription(
					stripeCustomer.customerId,
					{plan: planId},
					subscriptionHandler
				);
			});


		});

	});

	//app.post('api/stripe/events',
	//	stripeWebhook.middleware,
	//	stripeEvents.stripeEvent
	//);
};
