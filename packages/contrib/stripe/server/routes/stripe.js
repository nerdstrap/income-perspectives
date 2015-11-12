'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');

/* jshint -W098 */
// The Package is passed automatically as first parameter
module.exports = function (Stripe, app, auth, database) {

	app.get('/api/stripe/admin/settings', auth.requiresLogin, function (req, res, next) {
		Stripe.settings(function (err, config) {
			if (err) return res.json(500);
			if (req.user.isAdmin()) {
				return res.json(200, config ? config.settings : {});
			}
			res.json(200, config ? {publicKey: config.settings.publicKey} : {});
		});
	});

	app.post('/api/stripe/admin/settings', auth.requiresAdmin, function (req, res, next) {
		Stripe.settings(req.body, function (err, config) {
			if (err) {
				return res.json(500);
			}
			res.json(200, config ? config.settings : {});
			Stripe.createClient();
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
				return res.json(500);
			}
			res.jsonp(plans.data);
		});
	});

	app.get('/api/stripe/cards', auth.requiresLogin, function (req, res, next) {
		User.findOne({
			_id: req.user._id
		}, function (err, user) {
			if (err) {
				return res.send(500);
			}

			if (!user.profile || !user.profile.stripe) {
				return res.send(200, {
					has_more: false,
					data: []
				});
			}

			var cid = req.user.profile.stripe.cid;

			Stripe.client.customers.listCards(cid, {
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

		});
	});

	app.post('/api/stripe/cards', auth.requiresLogin, function (req, res, next) {

		User.findOne({
			_id: req.user._id
		}, function (err, user) {
			if (err) {
				return res.send(500);
			}

			//Stripe customer id
			var token = req.body.token;
			var cid = (user.profile && user.profile.stripe && user.profile.stripe.cid) ? user.profile.stripe.cid : null;

			if (!cid) {
				//Create a new customer
				Stripe.client.customers.create({
					source: token.id,
					description: req.user.username
				}).then(function (customer) {
					User.update({_id: req.user._id}, {$set: {'profile.stripe.cid': customer.id}}, function (err) {
						if (err) {
							return res.send(500);
						}
						res.send(200);
					});

				});

			} else {
				//Add card to existing customer
				Stripe.client.customers.createCard(
					cid, {
						card: token.id
					},
					function (err, card) {
						if (err) {
							return res.send(500);
						}
						res.send(200);
						// asynchronously called
					});
			}
		});
	});

};
