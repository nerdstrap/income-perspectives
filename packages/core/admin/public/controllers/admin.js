'use strict';

function AdminController($scope, Global, $state) {
	$scope.global = Global;
	$scope.$state = $state;
	$scope.package = {
		name: 'admin'
	};
}

var app = angular.module('mean.admin');
app.controller('AdminController', AdminController);
