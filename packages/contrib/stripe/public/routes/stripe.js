'use strict';
function StripeRoutes($stateProvider) {

	$stateProvider
		.state('stripe', {
			url: '/stripe',
			abstract: true,
			templateUrl: 'stripe/views/stripe.html'
		})
		.state('stripe.admin', {
			url: '/admin',
			templateUrl: 'stripe/views/admin.html'
		})
		.state('stripe.cards', {
			url: '/cards',
			templateUrl: 'stripe/views/cards.html'
		})
		.state('stripe.plans', {
			url: '/plans',
			templateUrl: 'stripe/views/plans.html'
		});
}

var app = angular.module('mean.stripe');
app.config(StripeRoutes);
