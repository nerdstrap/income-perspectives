'use strict';

var app = angular.module('mean.dc-max');
app.factory('IbidFactory', IbidFactory);

function IbidFactory($http) {
	var urlBase = 'api/dc-max/ibid';
	var ibidFactory = {};

	ibidFactory.getBaseline = function (worksheet) {
		return $http.get(urlBase + '/baseline', {
			params: worksheet
		});
	};

	ibidFactory.getBreakEvenAnalysis = function (worksheet) {
		return $http.get(urlBase + '/break-even-analysis', {
			params: worksheet
		});
	};

	ibidFactory.getPdf = function (worksheet) {
		return $http.get(urlBase + '/pdf', {
			params: worksheet,
			responseType: 'arraybuffer'
		});
	};

	return ibidFactory;
}
