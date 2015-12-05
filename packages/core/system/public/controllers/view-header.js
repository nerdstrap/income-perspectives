'use strict';

function ViewHeaderController($scope, $rootScope, $state) {
	var vm = this;

	vm.master = {};

	vm.status = {
		collapsed: false
	};

	function setup() {
		vm.view = {
			title: 'Page Title',
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
app.controller('ViewHeaderController', ViewHeaderController);
