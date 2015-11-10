'use strict';

/* jshint -W098 */
// The Package is passed automatically as first parameter
module.exports = function (DcMax, app, auth, database) {
	var controller = require('../controllers/stripe')(DcMax);
	app.route('/api/dc-max/stripe/plans')
		.get(controller.getBaseline);
};
