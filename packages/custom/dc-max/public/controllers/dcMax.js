'use strict';

var app = angular.module('mean.dc-max');
app.controller('DcMaxController', DcMaxController);

function DcMaxController($scope, $rootScope, $http, $state, Global) {
	$scope.global = Global;
	$scope.$state = $state;
	$scope.package = {
		name: 'dc-max'
	};

	$http.get('/api/get-config')
		.success(function (config) {
			if (config.hasOwnProperty('local')) {
				// Only non-local passport strategies
				delete config.local;
			}
		});
}
