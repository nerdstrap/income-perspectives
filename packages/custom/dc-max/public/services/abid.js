'use strict';

var app = angular.module('mean.dc-max');
app.factory('AbidFactory', AbidFactory);

function AbidFactory($http) {
	var urlBase = 'api/dc-max/abid';
	var abidFactory = {};

	abidFactory.getBaseline = function (worksheet) {
		return $http.get(urlBase + '/baseline', {
			params: worksheet
		});
	};

	abidFactory.getBreakEvenAnalysis = function (worksheet) {
		return $http.get(urlBase + '/break-even-analysis', {
			params: worksheet
		});
	};

	abidFactory.getPdf = function (worksheet) {
		return $http.get(urlBase + '/pdf', {
			params: worksheet,
			responseType: 'arraybuffer'
		});
	};

	return abidFactory;
}
