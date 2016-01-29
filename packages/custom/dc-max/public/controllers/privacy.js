'use strict';

function PrivacyController($scope, $rootScope, $stateParams, focus, AuthFactory) {
	var vm = this;

	vm.view = {
		title: 'Privacy Policy',
		parentSref: 'home',
		parentTitle: 'Home'
	};
}

var app = angular.module('mean.users');
app.controller('PrivacyController', PrivacyController);
