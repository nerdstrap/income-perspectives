'use strict';

var mean = require('ns-meanio');

module.exports = function (Admin, app, auth, database) {

	var users = require('../controllers/users');
	app.get('/api/admin/users', auth.requiresAdmin, users.all);
	app.post('/api/admin/users', auth.requiresAdmin, users.create);
	app.put('/api/admin/users/:userId', auth.requiresAdmin, users.update);
	app.delete('/api/admin/users/:userId', auth.requiresAdmin, users.destroy);

	app.get('/api/admin/modules', auth.requiresAdmin, function (req, res) {
		//var modules = mean.exportable_modules_list;
		//res.jsonp(modules);
		//for (var index in mean.resolved) {
		//   //console.log(mean.resolved);
		//   if (mean.resolved[index].result) console.log(mean.resolved[index].result.loadedmodule);
		//}
	});

	var settings = require('../controllers/settings');
	app.get('/api/admin/settings', auth.requiresAdmin, settings.get);
	app.put('/api/admin/settings', auth.requiresAdmin, settings.save);

	var moduleSettings = require('../controllers/module-settings');
	app.get('/api/admin/moduleSettings/:name', auth.requiresAdmin, moduleSettings.get);
	app.post('/api/admin/moduleSettings/:name', auth.requiresAdmin, moduleSettings.save);
	app.put('/api/admin/moduleSettings/:name', auth.requiresAdmin, moduleSettings.update);

};
