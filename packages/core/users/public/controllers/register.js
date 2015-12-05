'use strict';

function RegisterController($scope, $rootScope, focus, AuthFactory, UsersSettingsFactory) {
	var vm = this;

	vm.master = {};

	vm.status = {
		showPassword: false
	};

	function getSocialButtons() {
		UsersSettingsFactory.getConfig()
			.then(
				function (socialButtons) {
					vm.socialButtons = angular.copy(socialButtons);
				},
				function (error) {
					console.log(error);
				}
			);
	}

	function register(user) {
		vm.errors.splice(0, vm.errors.length);
		if (vm.regFrm.$valid) {
			AuthFactory.register(user)
				.then(
					function (response) {
						console.log('register success');
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
		vm.socialButtons = angular.copy(vm.master);
		vm.errors = [];
		focus('firstOpened');
	}

	function reset() {
		vm.user = angular.copy(vm.master);
		vm.socialButtons = angular.copy(vm.master);
		focus('firstOpened');
		vm.errors.splice(0, vm.errors.length);
		vm.regFrm.$setUntouched();
		vm.regFrm.$setPristine();
	}

	vm.getSocialButtons = getSocialButtons;
	vm.register = register;
	vm.init = init;
	vm.reset = reset;

	vm.init();
	vm.getSocialButtons();
}

var app = angular.module('mean.users');
app.controller('RegisterController', RegisterController);
