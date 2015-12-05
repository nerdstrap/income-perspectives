'use strict';

var mean = require('ns-meanio');

module.exports = function (System, app, auth, database) {

	var index = require('../controllers/index')(System);

	app.route('/')
		.get(index.render);

	app.route('/api/aggregatedassets')
		.get(index.aggregatedList);

	app.get('/*', function (req, res, next) {
		res.header('workerID', JSON.stringify(mean.options.workerid));
		next();
	});

	app.get('/api/get-public-config', function (req, res) {
		var config = mean.loadConfig();
		return res.send(config.public);
	});

};
