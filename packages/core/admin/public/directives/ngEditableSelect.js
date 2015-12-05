'use strict';

function ngEditableSelect() {
	return {
		template: '<span class="editable-wrapper">' + '<span data-ng-hide="edit" data-ng-click="edit=true;value=model;"><span data-ng-repeat="m in model">{{m}};</span></span>' + '<select data-ng-model="value" data-ng-show="edit" data-ng-multiple="true" multiple data-ng-options="option for option in options" data-ng-change="model=value;edit=false;">' + '<option value="">Choose Option</option>' + '</select>' + '</span>',
		scope: {
			text: '&ngEditableSelectText',
			model: '=ngEditableSelectModel',
			options: '=ngEditableSelectOptions',
			update: '&ngEditableSelect'
		},
		transclude: true,
		replace: true,
		link: function (scope, element, attrs) {
			scope.$watch('edit', function (isEditable) {
				if (isEditable === false) {
					scope.update();
				}
			});
		}
	};
}

var app = angular.module('mean.admin');
app.directive('ngEditableSelect', ngEditableSelect);
