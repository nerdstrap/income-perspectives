'use strict';

function StripeAdminController($scope, $rootScope, StripeFactory) {
	var vm = this;

	vm.master = {};

	function getSettings() {
		StripeFactory.getSettings()
			.success(function (data) {
				vm.settings = angular.copy(data);
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to get stripe settings.';
			});
	}

	function updateSettings(settings) {
		if (vm.setFrm.$valid) {
			StripeFactory.updateSettings(settings)
				.success(function (data) {
					vm.settings = angular.copy(data);
				})
				.error(function (error) {
					console.log(error);
					vm.status.response = 'Unable to get stripe settings.';
				});
		}
	}

	function init() {
		vm.settings = angular.copy(vm.master);
		focus('firstOpened');
	}

	function reset() {
		vm.init();
		vm.setFrm.$setUntouched();
		vm.setFrm.$setPristine();
	}

	vm.getSettings = getSettings;
	vm.updateSettings = updateSettings;
	vm.init = init;
	vm.reset = reset;

	vm.init();
	vm.getSettings();
}

/* jshint -W098 */
var app = angular.module('mean.stripe');
app.controller('StripeAdminController', StripeAdminController);
