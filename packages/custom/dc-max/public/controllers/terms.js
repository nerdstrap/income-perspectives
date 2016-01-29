'use strict';

function TermsController($scope, $rootScope, $stateParams, focus, AuthFactory) {
	var vm = this;

	vm.view = {
		title: 'Terms and Conditions',
		parentSref: 'home',
		parentTitle: 'Home'
	};
}

var app = angular.module('mean.users');
app.controller('TermsController', TermsController);
