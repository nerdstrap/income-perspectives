'use strict';

function AuthController($scope, Global, $state) {
	$scope.global = Global;
	$scope.$state = $state;
}

var app = angular.module('mean.users');
app.controller('AuthController', AuthController);
