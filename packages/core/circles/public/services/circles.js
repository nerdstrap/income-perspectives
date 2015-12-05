'use strict';

function Circles($resource) {

	return $resource('api/circles/:name', {
		name: '@name'
	}, {
		update: {
			method: 'PUT'
		},
		mine: {
			method: 'GET',
			isArray: false,
			url: '/api/circles/mine'
		},
		all: {
			method: 'GET',
			isArray: false,
			url: '/api/circles/all'
		}
	});

}

var app = angular.module('mean.circles');
app.factory('Circles', Circles);
