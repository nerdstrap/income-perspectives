'use strict';

function Views($scope, $rootScope, $stateParams, $q, $timeout) {
	var viewsFactory = {};

	viewsFactory.updateViewHeader = function () {
		var deferred = $q.defer();
		$rootScope.viewTitle = $stateParams.title || 'Index Annuity';
		$rootScope.viewParentTitle = $stateParams.parentTitle || 'Home';
		$rootScope.viewParentSref = $stateParams.parentSref || 'home';
		$timeout(deferred.resolve);
		return deferred.promise;
	};

	return viewsFactory;
}

var app = angular.module('mean.system');
app.factory('Views', Views);
