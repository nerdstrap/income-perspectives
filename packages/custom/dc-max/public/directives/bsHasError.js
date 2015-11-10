'use strict';

var app = angular.module('mean.dc-max');
app.directive('bsHasError', bsHasError);

function bsHasError(bsProcessValidator) {
	return {
		restrict: 'A',
		link: function (scope, element) {
			bsProcessValidator(scope, element, 'ng-invalid', 'has-error');
		}
	};
}
