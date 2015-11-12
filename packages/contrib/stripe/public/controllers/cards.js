'use strict';

function CardsController($scope, $rootScope, Global, StripeFactory) {
	$scope.global = Global;
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

	var vm = this;

	vm.master = {};
	vm.status = {
		addCardDisabled: true
	};
	vm.cards = [];


	function getSettings() {
		StripeFactory.getSettings()
			.success(function (settings) {
				vm.settings = angular.copy(settings);
				installStripeClient(vm.settings.publicKey, function () {
					vm.status.addCardDisabled = false;
					$scope.$apply();
				});
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to get stripe settings.';
			});
	}

	function getCards() {
		StripeFactory.getCards()
			.success(function (cards) {
				vm.cards = angular.copy(cards.data);
			})
			.error(function (error) {
				console.log(error);
				vm.status.response = 'Unable to get stripe cards.';
			});
	}

	function createTokenResponseHandler(status, response) {
		StripeFactory.addCard(response);
		vm.status.addCardDisabled = false;
		$scope.$apply();
	}

	function addCard() {
		vm.status.addCardDisabled = true;
		var formData = {
			number: vm.newCard.number,
			cvc: vm.newCard.cvc,
			exp_month: vm.newCard.month,
			exp_year: vm.newCard.year
		};
		Stripe.card.createToken(formData, createTokenResponseHandler);
		return false;
	}

	function init() {
		vm.newCard = {
			number: '4242424242424242',
			month: '12',
			year: '16',
			cvc: '123'
		};
		vm.getCards();
	}

	function reset() {
		vm.init();
	}

	vm.getSettings = getSettings;
	vm.getCards = getCards;
	vm.addCard = addCard;
	vm.init = init;
	vm.reset = reset;

	vm.init();
	vm.getSettings();

}

/* jshint -W098 */
var app = angular.module('mean.stripe');
app.controller('CardsController', CardsController);
