'use strict';

function IndexController($scope, Global) {
	var vm = this;

	vm.master = {};

	function setup() {
		vm.view = {
			title: 'Whats this',
			rootUrl: '/',
			rootTitle: 'Home'
		};
	}

	function init() {
		vm.view = angular.copy(vm.master);
	}

	function reset() {
		vm.init();
	}

	vm.setup = setup;
	vm.init = init;
	vm.reset = reset;

	vm.init();
	vm.setup();
}

var app = angular.module('mean.system');
app.controller('IndexController', IndexController);
