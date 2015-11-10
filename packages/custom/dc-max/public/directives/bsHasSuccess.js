'use strict';

var app = angular.module('mean.dc-max');
app.directive('bsHasSuccess', bsHasSuccess);

function bsHasSuccess(bsProcessValidator) {
	return {
		restrict: 'A',
		link: function (scope, element) {
			bsProcessValidator(scope, element, 'ng-valid', 'has-success');
		}
	};
}
