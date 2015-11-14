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
		.state('stripe.subscription', {
			url: '/subscription',
			templateUrl: 'stripe/views/subscription.html'
		});
}

var app = angular.module('mean.stripe');
app.config(StripeRoutes);
