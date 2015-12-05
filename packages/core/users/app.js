'use strict';

var mean = require('ns-meanio');
var Module = mean.Module;

/*
 * 1. Define the Package
 */
function Users() {
	Module.call(this, 'users');
	this.auth = null;
}
Users.prototype = Object.create(Module.prototype, {
	constructor: {
		value: Users,
		configurable: false,
		enumerable: false,
		writable: false
	}
});
var users = new Users();

/*
 * 2. Register the Package (required Packages are added via Dependency Injection)
 */
users.register(function (app, database, passport) {

	/*
	 * X. Register the 'auth' Package
	 */
	users.auth = require('./authorization');
	require('./passport')(passport);
	mean.register('auth', users.auth);

	/*
	 * 3. Handle Express routes (the Package is passed by default)
	 */
	users.routes(app, users.auth, database, passport);

	/*
	 * 4. Specify client dependencies
	 */
	users.aggregateAsset('css', 'users.css');
	users.aggregateAsset('js', '../lib/angular-jwt/dist/angular-jwt.min.js', {
		absolute: false,
		global: true
	});
	users.angularDependencies(['angular-jwt']);

	users.events.defaultData({
		type: 'user'
	});

	return users;
});
