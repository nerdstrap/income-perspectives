'use strict';

var mean = require('meanio');
var filed = require('filed');
var querystring = require('querystring');
var mime = require('mime');
var _tmpFilePath = './tmp/';
var abid = require('../libs/abid.js');

function getGenericReport(reportFileName, reportUrl, req, res, next) {
	var phantom = require('phantom');
	phantom.create('--ignore-ssl-errors=yes', '--ssl-protocol=any', function (ph) {
		console.log('phantom created');

		ph.createPage(function (page) {
			console.log('createPage: ' + JSON.stringify(page));

			page.set('viewportSize', {width: 1575, height: 1650}, function (result) {
				page.open(reportUrl, function (status) {
					console.log('page open? ' + status);

					if (status === 'success') {

						setTimeout(function () {
							var reportFilePath = _tmpFilePath + reportFileName;
							page.render(reportFilePath, function () {
								console.log('page render');

								res.contentType = mime.lookup(reportFilePath);
								var stream = filed(reportFilePath);
								stream.pipe(res);
								stream.on('end', function () {
									return next(false);
								});

								page.close();
								page = null;
								ph.exit();
							});

						}, 1000);
					}
					else {
						res.writeHead(404, {'Content-Type': 'text/plain'});
						res.end('404 Not Found');
						page.close();
						page = null;
						ph.exit();
					}
				});
			});
		});
	});
}

module.exports = function (DcMax) {
	return {

		getBaseline: function (req, res) {
			var worksheet = abid.mapWorksheet(req.query);
			var baseline = abid.getBaseline(worksheet.currentAge, worksheet.retirementAge, worksheet.numberOfPeriods, worksheet.initialDeposit, worksheet.rateOfReturn, worksheet.managementFee, worksheet.initialWithdrawal, worksheet.inflationRate);
			res.json(baseline);
		},

		getBreakEvenAnalysis: function (req, res) {
			var worksheet = abid.mapWorksheet(req.query);
			var breakEvenAnalysis = abid.getBreakEvenAnalysis(worksheet.currentAge, worksheet.retirementAge, worksheet.numberOfPeriods, worksheet.initialDeposit, worksheet.rateOfReturn, worksheet.managementFee, worksheet.insuranceProductIncome, worksheet.initialWithdrawal, worksheet.inflationRate);
			res.json(breakEvenAnalysis);
		},

		getReport: function (req, res) {
			var worksheet = abid.mapWorksheet(req.query);
			var breakEvenAnalysis = abid.getBreakEvenAnalysis(worksheet.currentAge, worksheet.retirementAge, worksheet.numberOfPeriods, worksheet.initialDeposit, worksheet.rateOfReturn, worksheet.managementFee, worksheet.insuranceProductIncome, worksheet.initialWithdrawal, worksheet.inflationRate);
			res.locals.package = 'dc-max';
			res.locals.worksheet = worksheet;
			res.locals.breakEvenAnalysis = breakEvenAnalysis;
			DcMax.render(
				'abid-report'
				, res.locals
				, function (err, html) {
					res.send(html);
				});
		},

		getPdf: function (req, res, next) {
			console.log('query = ' + JSON.stringify(req.query));
			var rawQuerystring = querystring.stringify(req.query);
			var reportFileName = 'abid-report.pdf';
			var reportUrl = req.protocol + '://' + req.get('host') + '/api/dc-max/abid/report?' + rawQuerystring;
			getGenericReport(reportFileName, reportUrl, req, res, next);
		}

	};
};
