'use strict';

function Modules($http) {

	return {

		get: function (callback) {
			$http.get('/api/admin/modules')
				.success(function (data) {
					callback(data);
				});
		}

	};

}

var app = angular.module('mean.admin');
app.factory('Modules', Modules);
