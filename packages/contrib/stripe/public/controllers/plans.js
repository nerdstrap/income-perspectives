'use strict';

function PlansController($scope, $rootScope, StripeFactory) {
	var vm = this;

	vm.master = [];

	function getPlans() {
		StripeFactory.getPlans()
			.success(function (plans) {
				vm.plans = angular.copy(plans);
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to get stripe plans.';
			});
	}

	function init() {
		vm.plans = angular.copy(vm.master);
	}

	function reset() {
		vm.init();
	}

	vm.getPlans = getPlans;
	vm.init = init;
	vm.reset = reset;

	vm.init();
	vm.getPlans();
}

/* jshint -W098 */
var app = angular.module('mean.stripe');
app.controller('PlansController', PlansController);
