'use strict';

function StripeFactory($http) {
	var urlBase = 'api/stripe';
	var stripeFactory = {};

	stripeFactory.getSettings = function () {
		return $http.get(urlBase + '/admin/settings');
	};

	stripeFactory.updateSettings = function (settings) {
		return $http.post(urlBase + '/admin/settings', settings);
	};

	stripeFactory.getPlans = function () {
		return $http.get(urlBase + '/plans');
	};

	stripeFactory.getCards = function () {
		return $http.get(urlBase + '/cards');
	};

	stripeFactory.addCard = function (token) {
		return $http.post(urlBase + '/cards', {
			token: token
		});
	};

	stripeFactory.addSubscription = function (planId) {
		return $http.post(urlBase + '/subscription', {
			planId: planId
		});
	};

	return stripeFactory;
}

var app = angular.module('mean.stripe');
app.factory('StripeFactory', StripeFactory);
