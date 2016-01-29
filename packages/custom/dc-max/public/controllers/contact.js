'use strict';

function ContactController($scope, $rootScope, $stateParams, focus, AuthFactory) {
	var vm = this;

	vm.view = {
		title: 'Contact Us',
		parentSref: 'home',
		parentTitle: 'Home'
	};

	vm.master = {};

	vm.status = {
		errorVisible: false
	};

	function sendMessage(message) {
		vm.errors.splice(0, vm.errors.length);
		if (vm.contactFrm.$valid) {
		}
	}

	function init() {
		vm.message = angular.copy(vm.master);
		vm.errors = [];
		focus('firstOpened');
		var title = $stateParams.title;
	}

	function reset() {
		vm.message = angular.copy(vm.master);
		vm.errors.splice(0, vm.errors.length);
		focus('firstOpened');
		vm.contactFrm.$setUntouched();
		vm.contactFrm.$setPristine();
	}

	vm.sendMessage = sendMessage;
	vm.init = init;
	vm.reset = reset;

	vm.init();
}

var app = angular.module('mean.users');
app.controller('ContactController', ContactController);
