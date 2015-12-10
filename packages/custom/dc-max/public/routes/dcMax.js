'use strict';

function DcMaxRoutes($stateProvider) {

	$stateProvider
		.state('dcMax', {
			url: '/dc-max',
			abstract: true,
			templateUrl: 'dc-max/views/dc-max.html'
		})
		.state('dcMax.contact', {
			url: '/contact',
			params: {
				title: 'Contact Us',
			},
			templateUrl: 'dc-max/views/contact.html'
		})
		.state('dcMax.index', {
			url: '/index',
			params: {
				title: 'dcMax',
			},
			templateUrl: 'dc-max/views/index.html',

		})
		.state('dcMax.abid', {
			url: '/abid',
			params: {
				title: 'Index Annuity',
			},
			templateUrl: 'dc-max/views/abid.html'
		})
		.state('dcMax.ibid', {
			url: '/ibid',
			params: {
				title: 'Index UL',
			},
			templateUrl: 'dc-max/views/ibid.html'
		})
		.state('dcMax.privacy', {
			url: '/privacy',
			params: {
				title: 'Privacy Policy',
			},
			templateUrl: 'dc-max/views/privacy.html'
		})
		.state('dcMax.terms', {
			url: '/terms',
			params: {
				title: 'Terms and Conditions',
			},
			templateUrl: 'dc-max/views/terms.html'
		})
		.state('dcMax.value-proposition', {
			url: '/value-proposition',
			params: {
				title: 'Value Proposition',
			},
			templateUrl: 'dc-max/views/value-proposition.html'
		});
}

var app = angular.module('mean.dc-max');
app.config(DcMaxRoutes);
