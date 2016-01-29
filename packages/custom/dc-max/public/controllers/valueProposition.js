'use strict';

function ValuePropositionController($scope, $rootScope, $stateParams, focus, AuthFactory) {
	var vm = this;

	vm.view = {
		title: 'Value Proposition',
		parentSref: 'home',
		parentTitle: 'Home'
	};
}

var app = angular.module('mean.users');
app.controller('ValuePropositionController', ValuePropositionController);
