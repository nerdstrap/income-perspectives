'use strict';

var Module = require('ns-meanio').Module;

/*
 * 1. Define the Package
 */
var Admin = new Module('admin');

/*
 * 2. Register the Package (required Packages are added via Dependency Injection)
 */
Admin.register(function (app, auth, database) {

	/*
	 * 3. Handle Express routes (the Package is passed by default)
	 */
	Admin.routes(app, auth, database);

	/*
	 * 4. Specify client dependencies
	 */
	Admin.aggregateAsset('css', 'admin.css');
	Admin.aggregateAsset('js', '../lib/ng-clip/src/ngClip.js', {
		absolute: false,
		global: true
	});
	Admin.aggregateAsset('js', '../lib/zeroclipboard/dist/ZeroClipboard.js', {
		absolute: false,
		global: true
	});
	Admin.angularDependencies(['ngClipboard']);

	/*
	 * 5. Inject Menu
	 */
	Admin.menus.add({
		title: 'Site Admin',
		link: 'admin',
		roles: ['admin'],
		menu: 'main',
		weight: 1000
	});

	return Admin;
});
