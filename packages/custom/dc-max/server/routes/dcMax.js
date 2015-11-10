'use strict';

/* jshint -W098 */
// The Package is passed automatically as first parameter
module.exports = function (DcMax, app, auth, database) {
	var controller = require('../controllers/dcMax')(DcMax);
	app.route('/api/dc-max/abid/baseline')
		.get(controller.getBaseline);
	app.route('/api/dc-max/abid/break-even-analysis')
		.get(controller.getBreakEvenAnalysis);
	app.route('/api/dc-max/abid/report')
		.get(controller.getReport);
	app.route('/api/dc-max/abid/pdf')
		.get(controller.getPdf);
};
