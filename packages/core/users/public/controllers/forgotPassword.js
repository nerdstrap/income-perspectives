'use strict';

function ForgotPasswordController($scope, $rootScope, focus, AuthFactory) {
	var vm = this;

	vm.master = {};

	vm.status = {
		errorVisible: false
	};

	function forgotPassword(user) {
		vm.errors.splice(0, vm.errors.length);
		if (vm.forgotFrm.$valid) {
			AuthFactory.forgotPassword(user)
				.then(
					function (response) {
						console.log('forgot password success');
					},
					function (error) {
						console.log(error);
						vm.errors.push(error);
					}
				);
		}
	}

	function init() {
		vm.user = angular.copy(vm.master);
		vm.errors = [];
		focus('firstOpened');
	}

	function reset() {
		vm.user = angular.copy(vm.master);
		vm.errors.splice(0, vm.errors.length);
		focus('firstOpened');
		vm.forgotFrm.$setUntouched();
		vm.forgotFrm.$setPristine();
	}

	vm.forgotPassword = forgotPassword;
	vm.init = init;
	vm.reset = reset;

	vm.init();
}

var app = angular.module('mean.users');
app.controller('ForgotPasswordController', ForgotPasswordController);
