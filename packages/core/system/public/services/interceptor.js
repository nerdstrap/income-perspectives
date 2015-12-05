'use strict';

function httpInterceptor($q, $location) {

	return {
		'response': function (response) {
			if (response.status === 401) {
				$location.path('/auth/login');
				return $q.reject(response);
			}
			return response || $q.when(response);
		},

		'responseError': function (rejection) {

			if (rejection.status === 401) {
				$location.url('/auth/login');
				return $q.reject(rejection);
			}
			return $q.reject(rejection);
		}
	};

}

function HttpProvider($httpProvider) {
	$httpProvider.interceptors.push('httpInterceptor');
}

var app = angular.module('mean-factory-interceptor', []);
app.factory('httpInterceptor', httpInterceptor);
app.config(HttpProvider);
