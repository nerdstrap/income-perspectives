'use strict';

var app = angular.module('mean.dc-max');
app.factory('focus', focus);

function focus($rootScope, $timeout) {
	return function (name) {
		$timeout(function () {
			$rootScope.$broadcast('focusOn', name);
		});
	}
}
