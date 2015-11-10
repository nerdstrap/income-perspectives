'use strict';

/* jshint -W098 */
angular.module('mean.stripe').controller('StripeController', ['$scope', '$http', 'Global', 'Stripe','$q',
	function($scope, $http, Global, Stripe, $q) {

		/*

		This will be refactored - dont panic - POC only

		*/
		$scope.global = Global;

		$scope.stripe = {
			settings: {}
		};

		function getSettings() {
            var deferred = $q.defer();
            if ($scope.stripe.settings.publicKey)
                deferred.resolve($scope.stripe.settings);

            else
                $http.get('api/stripe/config').success(function(data, status, headers, config) {
                    $scope.stripe.settings = data;
                    deferred.resolve(data);
                }).error(function(data, status, headers, config) {
                    deferred.reject(data);
                    $scope.stripe.response = data;
                });
            return deferred.promise;
		}


		function updateSettings() {
			$http.post('api/stripe/config', $scope.stripe.settings).success(function(data, status, headers, config) {
				$scope.stripe.settings = data;
                alert("Update Settings success!");
			}).error(function(data, status, headers, config) {
				$scope.stripe.response = data;
                alert("Update settings failed");
			});
		}

		function getCards() {
			$http.get('api/stripe/cards').success(function(data, status, headers, config) {
				$scope.stripe.cards = data.data;
			}).error(function(data, status, headers, config) {
			});
		}

        function getPlans() {
            $http.get('api/stripe/plans').success(function(data, status, headers, config) {
                $scope.stripe.plans = data;
            }).error(function(data, status, headers, config) {
            });
        }

        function pay(planId) {
            $http.post('api/stripe/subscribe', {planId: planId}).success(function(data, status, headers, config) {
                alert("Subscribe success!");
            }).error(function(data, status, headers, config) {
                alert("Subscribe failed");
            });
        }

        function addCard(cb) {
            getSettings().then(function(data) {
                console.log('dada', data);
                loadScript("https://checkout.stripe.com/checkout.js", function loadForm() {
                    var handler = StripeCheckout.configure({
                        key: data.publicKey,
                        image: 'https://s3.amazonaws.com/stripe-uploads/fvYSHPwiPWjcXEybnpOnyYszUsgaNhfVmerchant-icon-1424775492889-logo.png',
                        token: function(token) {
                            $http.post('stripe/cards', {
                                token: token
                            }).success(function(data, status, headers, config) {
                                cb();
                                getCards();
                                alert('Success');
                            }).error(function(data, status, headers, config) {
                                alert('Fail');
                            });
                        }
                    });
                    // Open Checkout with further options
                    handler.open({
                        name: 'Mean Network',
                        description: '2 widgets',
                        panelLabel: 'Add Card',
                        allowRememberMe: false
                    });

                });
            });
        }

        function subscribe(planId) {
            if ($scope.global.user.profile && $scope.global.user.profile.stripe && $scope.global.user.profile.stripe.cid)
                return pay(planId);
            addCard(function() {
                pay(planId);
            });
        }

		this.getSettings = getSettings;
		this.updateSettings = updateSettings;
		this.getCards = getCards;
        this.getPlans = getPlans;
        this.subscribe = subscribe;
        this.pay = pay;
        this.addCard = addCard;

		// Refactor this
		function loadScript(src, callback) {
			var oHead = document.getElementsByTagName('head')[0];
			var oScript = document.createElement('script');
			oScript.type = 'text/javascript';
			oScript.src = src;
			oHead.appendChild(oScript);
			oScript.onload = callback;
		}



		$('#customButton').on('click', function(e) {
            addCard(function(){});
			e.preventDefault();
		});

		// Close Checkout on page navigation
		$(window).on('popstate', function() {
			handler.close();
		});

	}
]);
