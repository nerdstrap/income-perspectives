'use strict';

function DcMaxController($scope, $state, Global) {
	$scope.global = Global;
	$scope.$state = $state;
	$scope.package = {
		name: 'dc-max'
	};
}

var app = angular.module('mean.dc-max');
app.controller('DcMaxController', DcMaxController);
