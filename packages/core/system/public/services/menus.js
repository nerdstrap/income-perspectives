'use strict';

function Menus($resource) {
	return $resource('api/admin/menu/:name', {
		name: '@name',
		defaultMenu: '@defaultMenu'
	});
}

var app = angular.module('mean.system');
app.factory('Menus', Menus);
