'use strict';

function ngEnter() {
	return function (scope, elm, attrs) {
		elm.bind('keypress', function (e) {
			if (e.charCode === 13 && !e.ctrlKey) {
				scope.$apply(attrs.ngEnter);
			}
		});
	};
}

var app = angular.module('mean.admin');
app.directive('ngEnter', ngEnter);
