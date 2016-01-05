'use strict';

function ViewHeaderController($scope, $rootScope, $state, $stateParams) {
	var vm = this;

	vm.master = {};

	vm.status = {
		collapsed: false
	};

	function setup() {
		var title = $stateParams.title || 'Index Annuity';
		var parentTitle = $stateParams.parentTitle || 'Home';
		var parentSref = $stateParams.parentSref || 'home';
		vm.view = {
			title: title,
			parentSref: parentSref,
			parentTitle: parentTitle
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

	$rootScope.$on('updateviewheader', function (event, options) {
		if (!options) {
			options = {};
		}
		vm.view.title = options.title || 'Index Annuity';
		vm.view.parentSref = options.parentSref || 'home';
		vm.view.parentTitle = options.parentTitle || 'Home';
	});
}

var app = angular.module('mean.system');
app.controller('ViewHeaderController', ViewHeaderController);
