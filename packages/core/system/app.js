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

	SystemPackage.aggregateAsset('css', 'plugins.css');
	SystemPackage.aggregateAsset('css', 'blocks.css');
	SystemPackage.aggregateAsset('css', 'index-app.css');
	SystemPackage.aggregateAsset('css', '../fancybox/jquery.fancybox.css');
	SystemPackage.aggregateAsset('css', '../owl-carousel/owl.carousel.css');
	SystemPackage.aggregateAsset('css', '../master-slider/style/masterslider.css');
	SystemPackage.aggregateAsset('css', '../master-slider/skins/black-2/style.css');

	SystemPackage.aggregateAsset('js', '../master-slider/masterslider.min.js');
	SystemPackage.aggregateAsset('js', '../master-slider/jquery.easing.min.js');
	SystemPackage.aggregateAsset('js', '../counter/waypoints.min.js');
	SystemPackage.aggregateAsset('js', '../counter/jquery.counterup.min.js');
	SystemPackage.aggregateAsset('js', '../fancybox/jquery.fancybox.pack.js');
	SystemPackage.aggregateAsset('js', '../owl-carousel/owl.carousel.min.js');

	SystemPackage.aggregateAsset('js', 'index-app.js');
	SystemPackage.aggregateAsset('js', 'fancy-box.js');
	SystemPackage.aggregateAsset('js', 'owl-carousel.js');
	SystemPackage.aggregateAsset('js', 'master-slider-fw.js');

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
