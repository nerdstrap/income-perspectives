'use strict';

function UsersRoutes($meanStateProvider, $httpProvider, jwtInterceptorProvider) {

	jwtInterceptorProvider.tokenGetter = function () {
		return localStorage.getItem('JWT');
	};

	$httpProvider.interceptors.push('jwtInterceptor');

	// states for my app
	$meanStateProvider
		.state('auth', {
			url: '/auth',
			abstract: true,
			templateUrl: 'users/views/auth.html'
		})
		.state('auth.login', {
			url: '/login',
			templateUrl: 'users/views/login.html',
			resolve: {
				isAuthenticated: function (AuthFactory) {
					return AuthFactory.isAuthenticated();
				}
			}
		})
		.state('auth.register', {
			url: '/register',
			templateUrl: 'users/views/register.html',
			resolve: {
				isAuthenticated: function (AuthFactory) {
					return AuthFactory.isAuthenticated();
				}
			}
		})
		.state('auth.forgot-password', {
			url: '/forgot-password',
			templateUrl: 'users/views/forgot-password.html',
			resolve: {
				isAuthenticated: function (AuthFactory) {
					return AuthFactory.isAuthenticated();
				}
			}
		})
		.state('auth.reset-password', {
			url: '/reset-password/:tokenId',
			templateUrl: 'users/views/reset-password.html',
			resolve: {
				isAuthenticated: function (AuthFactory) {
					return AuthFactory.isAuthenticated();
				}
			}
		});

}

var app = angular.module('mean.users');
app.config(UsersRoutes);
