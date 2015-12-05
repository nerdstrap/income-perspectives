'use strict';

/*
 * Defining the Package
 */
var Module = require('ns-meanio').Module;

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
		title: 'Value Proposition',
		link: 'dcMax.value-proposition',
		menu: 'main',
		roles: ['all'],
		weight: 200
	});
	DcMax.menus.add({
		title: 'Index UL',
		link: 'dcMax.ibid',
		menu: 'main',
		roles: ['all'],
		weight: 300
	});
	DcMax.menus.add({
		title: 'Index Annuity',
		link: 'dcMax.abid',
		menu: 'main',
		roles: ['all'],
		weight: 400
	});
	DcMax.menus.add({
		title: 'Contact',
		link: 'dcMax.contact',
		menu: 'main',
		roles: ['all'],
		weight: 600
	});

	DcMax.aggregateAsset('css', 'dcMax.css');
	DcMax.aggregateAsset('js', '../lib/highcharts/highcharts.js');
	DcMax.aggregateAsset('js', '../lib/filesaver/FileSaver.min.js');

	return DcMax;
});
