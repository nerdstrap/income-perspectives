'use strict';

function DcMaxController($scope, $rootScope, $state, Global, $stateParams) {
	$scope.global = Global;
	$scope.$state = $state;
	$scope.package = {
		name: 'dc-max'
	};
}

var app = angular.module('mean.dc-max');
app.controller('DcMaxController', DcMaxController);
