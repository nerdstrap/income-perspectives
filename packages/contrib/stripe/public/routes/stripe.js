'use strict';

angular.module('mean.stripe')
	.config(['$stateProvider',
	function ($stateProvider) {
		$stateProvider.state('stripe admin', {
			url: '/stripe/admin',
			templateUrl: 'stripe/views/admin.html'
		});

		$stateProvider.state('stripe add card', {
			url: '/stripe/addCard',
			templateUrl: 'stripe/views/addCard.html'
		});

		$stateProvider.state('stripe plans', {
			url: '/stripe/products',
			templateUrl: 'stripe/views/plans.html'
		});
	}
]);
