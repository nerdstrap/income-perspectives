'use strict';

var app = angular.module('mean.dc-max');
app.directive('bsHas', bsHas);

function bsHas(bsProcessValidator) {
	return {
		restrict: 'A',
		link: function (scope, element) {
			bsProcessValidator(scope, element, 'ng-valid', 'has-success');
			bsProcessValidator(scope, element, 'ng-invalid', 'has-error');
		}
	};
}
