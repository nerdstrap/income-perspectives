'use strict';

function UsersFactory($resource) {
	return $resource('/api/admin/users/:userId', {
		userId: '@_id'
	}, {
		update: {
			method: 'PUT'
		}
	});
}

var app = angular.module('mean.admin');
app.factory('UsersFactory', UsersFactory);
