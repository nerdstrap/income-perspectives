'use strict';

function SubscriptionController($scope, $rootScope, Global, StripeFactory, AuthFactory) {

	var stripeLoaded = false;

	function loadScript(src, callback) {
		if (!stripeLoaded) {
			stripeLoaded = true;
			var documentHead = document.getElementsByTagName('head')[0];
			var scriptElement = document.createElement('script');
			scriptElement.type = 'text/javascript';
			scriptElement.src = src;
			documentHead.appendChild(scriptElement);
			scriptElement.onload = callback;
		}
	}

	function installStripeClient(publicKey, callback) {
		loadScript('https://js.stripe.com/v2', function () {
			Stripe.setPublishableKey(publicKey);
			callback();
		});
	}

	function createTokenResponseHandler(status, response) {
		StripeFactory.addCustomer(response)
			.success(function (data) {
				vm.addSubscription();
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to create stripe customer.';
			});
	}

	function createToken(formData) {
		Stripe.card.createToken(formData, createTokenResponseHandler);
	}

	var vm = this;

	vm.view = {
		title: 'Subscriptions',
		parentSref: 'home',
		parentTitle: 'Home'
	};

	vm.status = {
		showSubscribe: false,
		addNewCardDisabled: false,
		showUnsubscribe: false,
		unsubscribeDisabled: false
	};
	vm.customer = {};

	function getSettings() {
		StripeFactory.getSettings()
			.success(function (settings) {
				vm.settings = angular.copy(settings);
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to get stripe settings.';
			});
	}

	function getCustomer() {
		StripeFactory.getCustomer()
			.success(function (data) {
				vm.customer = angular.copy(data);
				if (vm.customer.subscriptionId) {
					vm.status.showSubscribe = false;
					vm.status.showUnsubscribe = true;
				} else {
					vm.status.showSubscribe = true;
					vm.status.showUnsubscribe = false;
				}
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to get stripe customer.';
			});
	}

	function subscribe() {
		vm.newCard = angular.copy({});
		vm.newCardFrm.$setUntouched();
		vm.newCardFrm.$setPristine();
		if (!stripeLoaded) {
			installStripeClient(vm.settings.publicKey, function () {
				vm.status.newCardVisible = true;
				vm.status.addNewCardDisabled = false;
				$scope.$apply();
			});
		} else {
			vm.status.newCardVisible = true;
		}
	}

	function cancelAddNewCard() {
		vm.newCard = angular.copy({});
		vm.status.newCardVisible = false;
	}

	function addNewCard() {
		vm.status.addNewCardDisabled = true;
		var formData = {
			number: vm.newCard.number,
			cvc: vm.newCard.cvc,
			exp_month: vm.newCard.month,
			exp_year: vm.newCard.year
		};
		createToken(formData);
	}

	function addSubscription() {
		StripeFactory.addSubscription('individuals')
			.success(function (data) {
				vm.customer = angular.copy(data);
				vm.status.newCardVisible = false;
				vm.status.showSubscribe = true;
				vm.status.showUnsubscribe = true;
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to add stripe subscription.';
			});
	}

	function unsubscribe() {
		vm.status.unsubscribeDisabled = true;
		StripeFactory.removeCustomer()
			.success(function (data) {
				vm.customer = angular.copy({});
				vm.status.showSubscribe = true;
				vm.status.showUnsubscribe = false;
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to remove stripe subscription.';
			});
	}

	function init() {
	}

	function reset() {
		vm.init();
	}

	vm.getSettings = getSettings;
	vm.getCustomer = getCustomer;

	vm.subscribe = subscribe;
	vm.cancelAddNewCard = cancelAddNewCard;
	vm.addNewCard = addNewCard;

	vm.addSubscription = addSubscription;
	vm.unsubscribe = unsubscribe;

	vm.init = init;
	vm.reset = reset;

	vm.init();
	vm.getSettings();
	vm.getCustomer();

}

/* jshint -W098 */
var app = angular.module('mean.stripe');
app.controller('SubscriptionController', SubscriptionController);
