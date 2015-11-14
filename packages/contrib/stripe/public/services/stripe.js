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

	//stripeFactory.getPlans = function () {
	//	return $http.get(urlBase + '/plans');
	//};

	stripeFactory.getCustomer = function () {
		return $http.get(urlBase + '/customer');
	};

	stripeFactory.addCustomer = function (token) {
		return $http.post(urlBase + '/customer', {
			token: token
		});
	};

	stripeFactory.addSubscription = function (planId) {
		return $http.post(urlBase + '/subscription', {
			planId: planId
		});
	};

	stripeFactory.removeCustomer= function () {
		return $http.delete(urlBase + '/customer');
	};

	return stripeFactory;
}

var app = angular.module('mean.stripe');
app.factory('StripeFactory', StripeFactory);
