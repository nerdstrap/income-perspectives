'use strict';

var meanio = require('ns-meanio');
var Module = meanio.Module;
var config = meanio.loadConfig();
var favicon = require('serve-favicon');

/*
 * 1. Define the Package
 */
var SystemPackage = new Module('system');

/*
 * 2. Register the Package (required Packages are added via Dependency Injection)
 */
SystemPackage.register(function (app, auth, database, circles) {

	/*
	 * 3. Handle Express routes (the Package is passed by default)
	 */
	SystemPackage.routes(app, auth, database);

	/*
	 * 4. Specify client dependencies
	 */
	SystemPackage.aggregateAsset('css', 'common.css');
	SystemPackage.aggregateAsset('css', 'header.css');
	SystemPackage.aggregateAsset('css', 'footer.css');
	SystemPackage.aggregateAsset('css', 'view-header.css');
	SystemPackage.angularDependencies(['mean-factory-interceptor']);

	/*
	 * Express Middleware will be configured BEFORE this Package
	 */
	app.set('views', __dirname + '/server/views');
	if (config.favicon) {
		app.use(favicon(config.favicon));
	} else {
		app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));
	}
	app.useStatic(__dirname + '/public/assets/static');

	return SystemPackage;

});
