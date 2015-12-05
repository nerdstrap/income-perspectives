'use strict';

function UsersSettingsFactory($http) {
	var urlBase = 'api';
	var socialFactory = {};

	socialFactory.getConfig = function () {
		return $http.get(urlBase + '/get-config')
			.then(
				function (response) {
					if (response && response.data) {
						if (response.data.hasOwnProperty('local')) {
							delete response.data.local;
						}
						return response.data;
					}
					return {};
				},
				function (error) {
					throw 'Social Plug-ins load error.'
				}
			);
	};

	return socialFactory;
}

var app = angular.module('mean.users');
app.factory('UsersSettingsFactory', UsersSettingsFactory);
