'use strict';

var AuthEvents = {
	'loggedIn': 'loggedIn',
	'loggedOut': 'loggedOut',
	'passwordReset': 'passwordReset',
	'forgotPasswordSent': 'forgotPasswordSent'
};

var app = angular.module('mean.users');
app.constant('AuthEvents', AuthEvents);
