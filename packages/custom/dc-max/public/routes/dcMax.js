'use strict';

angular.module('mean.dc-max')
	.config(['$stateProvider',
		function (stateProvider) {

			stateProvider
				.state('dcMax', {
					url: '/dc-max',
					abstract: true,
					templateUrl: 'dc-max/views/dc-max.html'
				})
				.state('dcMax.contact', {
					url: '/contact',
					templateUrl: 'dc-max/views/contact.html'
				})
				.state('dcMax.index', {
					url: '/index',
					templateUrl: 'dc-max/views/index.html'
				})
				.state('dcMax.abid', {
					url: '/abid',
					templateUrl: 'dc-max/views/abid.html'
				})
				.state('dcMax.privacy', {
					url: '/privacy',
					templateUrl: 'dc-max/views/privacy.html'
				})
				.state('dcMax.subscriptions', {
					url: '/subscriptions',
					templateUrl: 'dc-max/views/subscriptions.html'
				})
				.state('dcMax.terms', {
					url: '/terms',
					templateUrl: 'dc-max/views/terms.html'
				})
				.state('dcMax.value-proposition', {
					url: '/value-proposition',
					templateUrl: 'dc-max/views/value-proposition.html'
				});
		}
	]);
