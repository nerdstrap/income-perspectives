'use strict';

function ngEditableParagraph() {
	return {
		// can be in-lined or async loaded by xhr
		// or inlined as JS string (using template property)
		template: '<span class="editable-wrapper">' + '<span data-ng-hide="edit" data-ng-click="edit=true;value=model;" class="respect-newline">{{model}}</span>' + '<textarea data-ng-model="value" data-ng-blur="model=value ; edit=false" data-ng-show="edit" data-ng-enter="model=value;edit=false;" class="span8"></textarea>' + '</span>',
		scope: {
			model: '=ngEditableModel',
			update: '&ngEditableParagraph'
		},
		replace: true,
		link: function (scope, element, attrs) {
			scope.focus = function () {
				element.find("input").focus();
			};
			scope.$watch('edit', function (isEditable) {
				if (isEditable === false) {
					scope.update();
				} else {
					scope.focus();
				}
			});
		}
	};
}

var app = angular.module('mean.admin');
app.directive('ngEditableParagraph', ngEditableParagraph);
