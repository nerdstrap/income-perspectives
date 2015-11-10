'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var DcMax = new Module('dc-max');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
DcMax.register(function (app, auth, database) {

	//We enable routing. By default the Package Object is passed to the routes
	DcMax.routes(app, auth, database);

	//We are adding a link to the main menu for all authenticated users
	DcMax.menus.add({
		title: 'dcMax',
		link: 'dcMax.index',
		roles: ['authenticated'],
		menu: 'main'
	});

	DcMax.aggregateAsset('css', 'dcMax.css');
	DcMax.aggregateAsset('js', '../lib/highcharts/highcharts.js');

	return DcMax;
});
