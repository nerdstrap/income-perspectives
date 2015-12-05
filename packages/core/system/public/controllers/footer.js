'use strict';

function FooterController($scope, $rootScope, $state) {
	var vm = this;

	vm.master = {};

	vm.status = {
		collapsed: false
	};

	function init() {
		vm.user = angular.copy(vm.master);
	}

	function reset() {
		vm.init();
	}

	vm.init = init;
	vm.reset = reset;

	vm.init();
}

var app = angular.module('mean.system');
app.controller('FooterController', FooterController);
