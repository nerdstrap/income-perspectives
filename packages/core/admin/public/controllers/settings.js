'use strict';

function SettingsController($scope, AuthFactory) {

	var vm = this;

	vm.master = {};

	vm.status = {};

	function init() {
	}

	function reset() {
		vm.init();
	}

	vm.init = init;
	vm.reset = reset;

	vm.init();
}

var app = angular.module('mean.admin');
app.controller('SettingsController', SettingsController);
