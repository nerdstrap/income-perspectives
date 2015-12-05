'use strict';

var mean = require('ns-meanio');

module.exports = function (System) {

	return {

		render: function (req, res) {
			res.render('index', {locals: {config: System.config.clean}});
		},

		aggregatedList: function (req, res) {
			res.send(res.locals.aggregatedassets);
		}

	};

};
