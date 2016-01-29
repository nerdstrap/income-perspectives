'use strict';

function LoginController($scope, $rootScope, focus, AuthFactory) {
	var vm = this;

	vm.view = {
		title: 'Login',
		parentSref: 'home',
		parentTitle: 'Home'
	};

	vm.master = {};

	vm.status = {
		showPassword: false
	};

	function login(user) {
		vm.errors.splice(0, vm.errors.length);
		if (vm.loginFrm.$valid) {
			AuthFactory.login(user)
				.then(
					function (response) {
						console.log('login success');
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
		vm.loginFrm.$setUntouched();
		vm.loginFrm.$setPristine();
	}

	vm.login = login;
	vm.init = init;
	vm.reset = reset;

	vm.init();
}

var app = angular.module('mean.users');
app.controller('LoginController', LoginController);
