'use strict';

/* jshint -W098 */
// The Package is passed automatically as first parameter
module.exports = function (DcMax, app, auth, database) {

	var controller = require('../controllers/dcMax')(DcMax);
	app.route('/api/dc-max/abid/baseline')
		.get(controller.getAbidBaseline);
	app.route('/api/dc-max/abid/break-even-analysis')
		.get(controller.getAbidBreakEvenAnalysis);
	app.route('/api/dc-max/abid/report', auth.requiresLogin)
		.get(controller.getAbidReport);
	app.route('/api/dc-max/abid/pdf', auth.requiresLogin)
		.get(controller.getAbidPdf);
	app.route('/api/dc-max/ibid/baseline')
		.get(controller.getIbidBaseline);
	app.route('/api/dc-max/ibid/break-even-analysis')
		.get(controller.getIbidBreakEvenAnalysis);
	app.route('/api/dc-max/ibid/report', auth.requiresLogin)
		.get(controller.getIbidReport);
	app.route('/api/dc-max/ibid/pdf', auth.requiresLogin)
		.get(controller.getIbidPdf);

};
