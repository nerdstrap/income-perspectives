'use strict';


function CirclesRoutes($stateProvider) {

	$stateProvider
		.state('manage circles', {
			url: '/circles/manage',
			templateUrl: 'circles/views/index.html',
			resolve: {
				isAdmin: function (AuthFactory) {
					return AuthFactory.isAdmin();
				}
			}
		})
		.state('create circles', {
			url: '/circles/create',
			templateUrl: 'circles/views/create.html',
			resolve: {
				isAdmin: function (AuthFactory) {
					return AuthFactory.isAdmin();
				}
			}
		});

}
var app = angular.module('mean.circles');
app.config(CirclesRoutes);
