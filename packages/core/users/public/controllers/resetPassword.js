'use strict';

function ResetPasswordController($scope, $rootScope, focus, AuthFactory) {
	var vm = this;

	vm.master = {};

	vm.status = {};

	function resetPassword(user) {
		vm.errors.splice(0, vm.errors.length);
		if (vm.resetFrm.$valid) {
			AuthFactory.resetPassword(user)
				.then(
					function (response) {
						console.log('reset password success');
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
		vm.resetFrm.$setUntouched();
		vm.resetFrm.$setPristine();
	}

	vm.resetPassword = resetPassword;
	vm.init = init;
	vm.reset = reset;

	vm.init();
}

var app = angular.module('mean.users');
app.controller('ResetPasswordController', ResetPasswordController);
