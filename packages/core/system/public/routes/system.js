'use strict';

function $viewPath() {
	function ViewPathProvider() {
		var overrides = {};

		this.path = function (path) {
			return function () {
				return overrides[path] || path;
			};
		};

		this.override = function (defaultPath, newPath) {
			if (overrides[defaultPath]) {
				throw new Error('View already has an override: ' + defaultPath);
			}
			overrides[defaultPath] = newPath;
			return this;
		};

		this.$get = function () {
			return this;
		};
	}

	return new ViewPathProvider();
}

function $meanState($stateProvider, $viewPathProvider) {
	function MeanStateProvider() {
		this.state = function (stateName, data) {
			if (data.templateUrl) {
				data.templateUrl = $viewPathProvider.path(data.templateUrl);
			}
			$stateProvider.state(stateName, data);
			return this;
		};

		this.$get = function () {
			return this;
		};
	}

	return new MeanStateProvider();
}

function UrlRouteProvider($meanStateProvider, $urlRouterProvider) {

	// For unmatched routes:
	$urlRouterProvider.otherwise('/');

	// states for my app
	$meanStateProvider
		.state('home', {
			url: '/',
			templateUrl: 'system/views/index.html'
		});

}

function Html5Mode($locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}

var app = angular.module('mean.system');
app.provider('$viewPath', $viewPath);
app.provider('$meanState', $meanState);
app.config(UrlRouteProvider);
app.config(Html5Mode);
