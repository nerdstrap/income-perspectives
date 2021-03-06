'use strict';

var Module = require('ns-meanio').Module;
var Stripe = new Module('stripe');

Stripe.register(function (app, auth, database) {

	Stripe.menus.add({
		title: 'stripe admin',
		link: 'stripe.admin',
		roles: ['admin'],
		menu: 'main'
	});

	Stripe.menus.add({
		title: 'Subscriptions',
		link: 'stripe.subscription',
		roles: ['all'],
		menu: 'main',
		weight: 500
	});

	Stripe.routes(app, auth, database);

	Stripe.createClient = function () {
		delete Stripe.client;

		Stripe.settings(function (err, config) {

			if (err || !config) {
				return console.log('error retrieving Stripe settings.');
			}

			if (!config.settings && !config.settings.privateKey || !config.settings.publicKey) {
				return;
			}

			Stripe.client = require('stripe')(config.settings.privateKey);
		});
	};

	Stripe.createClient();

	Stripe.aggregateAsset('css', 'stripe.css');

	return Stripe;
});
