'use strict';

function SubscriptionController($scope, $rootScope, Global, StripeFactory, MeanUser) {

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
		var card = {
			last4: response.last4,
			brand: response.brand,
			exp_month: response.exp_month,
			exp_year: response.exp_year
		};
		StripeFactory.addCard(response)
			.success(function (data) {
				vm.status.newCardVisible = false;
				vm.getCards();
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to add card.';
			});
	}

	function createToken(formData) {
		Stripe.card.createToken(formData, createTokenResponseHandler);
	}

	var vm = this;

	vm.status = {
		newCardVisible: false,
		showUnsubscribe: false
	};
	vm.plans = [];
	vm.cards = [];

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

	function getCards() {
		StripeFactory.getCards()
			.success(function (cards) {
				vm.cards = angular.copy(cards.data);
				vm.status.subscribeEnabled = vm.cards.length;
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to get stripe cards.';
			});
	}

	function showNewCard() {
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
			vm.status.addNewCardDisabled = false;
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

	function subscribePaidPlan() {
		vm.status.subscribeEnabled = false;
		StripeFactory.addSubscription('individuals')
			.success(function (data) {
				vm.status.subscribeEnabled = true;
				alert();
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to add subscription.';
			});
	}

	function subscribeFreePlan() {
		vm.status.subscribeEnabled = false;
		StripeFactory.addSubscription('individuals')
			.success(function (data) {
				alert();
				vm.status.subscribeEnabled = true;
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to add subscription.';
			});
	}

	function init() {
		vm.paidPlan = false;
		vm.freePlan = true;
		vm.status.showUnsubscribe = MeanUser && MeanUser.user && MeanUser.user.stripe && MeanUser.user.stripe.plan === 'individuals';
	}

	function reset() {
		vm.init();
	}

	vm.getSettings = getSettings;

	vm.getPlans = getPlans;
	vm.getCards = getCards;

	vm.showNewCard = showNewCard;
	vm.cancelAddNewCard = cancelAddNewCard;
	vm.addNewCard = addNewCard;

	vm.subscribePaidPlan = subscribePaidPlan;
	vm.subscribeFreePlan = subscribeFreePlan;

	vm.init = init;
	vm.reset = reset;

	vm.init();
	vm.getSettings();
	vm.getPlans();
	vm.getCards();

}

/* jshint -W098 */
var app = angular.module('mean.stripe');
app.controller('SubscriptionController', SubscriptionController);
