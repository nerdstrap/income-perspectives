'use strict';

function StripeController($scope, $state, Global) {
	$scope.global = Global;
	$scope.$state = $state;
	$scope.package = {
		name: 'stripe'
	};
}

/* jshint -W098 */
var app = angular.module('mean.stripe');
app.controller('StripeController', StripeController);
