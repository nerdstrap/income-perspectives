'use strict';

var app = angular.module('mean.dc-max');
app.factory('SubscriptionsFactory', SubscriptionsFactory);

function SubscriptionsFactory($http) {
	var urlBase = 'api/dc-max/stripe';
	var subscriptionsFactory = {};

	subscriptionsFactory.getPlans = function () {
		return $http.get(urlBase + '/plans');
	};

	return subscriptionsFactory;
}
