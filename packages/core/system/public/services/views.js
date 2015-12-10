'use strict';

function Views($scope, $rootScope, $stateParams, $q, $timeout) {
	var viewsFactory = {};

	viewsFactory.updateViewHeader = function () {
		var deferred = $q.defer();
		$rootScope.viewTitle = $stateParams.title;
		$rootScope.viewParentSref = 'home';
		$rootScope.viewParentTitle = 'Home';
		$timeout(deferred.resolve);
		return deferred.promise;
	};

	return viewsFactory;
}

var app = angular.module('mean.system');
app.factory('Views', Views);
