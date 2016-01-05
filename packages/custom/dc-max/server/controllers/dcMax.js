'use strict';

var mean = require('ns-meanio');
var querystring = require('querystring');
var abid = require('../libs/abid.js');
var ibid = require('../libs/ibid.js');

/* phantomjs */
var session;
var outputDirectory = './tmp/';

function createPhantomSession(switches, callback) {
	if (session) {
		console.log('phantom session already exists');
		return callback(null, session);
	} else {
		require('phantom').create(switches[0], switches[1], function (_session) {
			console.log('phantom.create ' + switches[0] + ', ' + switches[1]);
			session = _session;
			return callback(null, session);
		}, {
			dnodeOpts: {
				weak: false
			}
		});
	}
}

process.on('exit', function (code, signal) {
	session.exit(0);
});


function renderPdf(session, options, callback) {

	var page = null;

	try {
		session.createPage(function (_page) {
			page = _page;
			_page.set('viewportSize', options.viewportSize, function (result) {
				_page.set('paperSize', options.paperSize, function (result) {
					_page.open(options.url, function (status) {
						if (status === 'success') {
							setTimeout(function () {
								var filename = options.outputDirectory + options.fileName;
								_page.render(filename, function () {
									console.log('phantom.render');
									_page.close();
									_page = null;
									callback(null, filename);
								});

							}, options.timeout);

						} else {
							_page.close();
							_page = null;
							callback('phantom.open: ' + status);
						}
					});
				});
			});
		});
	} catch (e) {
		try {
			if (page !== null) {
				page.close();
			}
		} catch (innerException) {
			e.innerException = innerException;
		}
		return callback('phantom exception: ' + JSON.stringify(e));
	}
}

module.exports = function (DcMax) {
	return {

		getAbidBaseline: function (req, res) {
			var worksheet = abid.mapWorksheet(req.query);
			var baseline = abid.getBaseline(worksheet.currentAge, worksheet.retirementAge, worksheet.numberOfPeriods, worksheet.initialDeposit, worksheet.rateOfReturn, worksheet.managementFee, worksheet.initialWithdrawal, worksheet.inflationRate);
			res.json(baseline);
		},

		getAbidBreakEvenAnalysis: function (req, res) {
			var worksheet = abid.mapWorksheet(req.query);
			var breakEvenAnalysis = abid.getBreakEvenAnalysis(worksheet.currentAge, worksheet.retirementAge, worksheet.numberOfPeriods, worksheet.initialDeposit, worksheet.rateOfReturn, worksheet.managementFee, worksheet.insuranceProductIncome, worksheet.initialWithdrawal, worksheet.inflationRate);
			res.json(breakEvenAnalysis);
		},

		getAbidReport: function (req, res) {
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

		getAbidPdf: function (req, res) {
			var rawQuerystring = querystring.stringify(req.query);
			var reportFileName = 'abid-report.pdf';
			var reportUrl = req.protocol + '://' + req.get('host') + '/api/dc-max/abid/report?' + rawQuerystring;
			var phantomOptions = ['--ignore-ssl-errors=yes', '--ssl-protocol=any'];
			var reportOptions = {
				viewportSize: {
					width: 1575,
					height: 1650
				},
				paperSize: {
					format: 'A4',
					orientation: 'portrait',
					border: '1in'
				},
				url: reportUrl,
				fileName: reportFileName,
				outputDirectory: outputDirectory,
				timeout: 2000
			};

			createPhantomSession(phantomOptions, function (error, _session) {
				if (error) {
					res.send(500, error);
				}

				renderPdf(_session, reportOptions, function (error, filename) {
					if (error) {
						res.send(500, error);
					}

					if (!filename) {
						res.send(404);
					}

					res.download(filename);
				});
			});
		},

		getIbidBaseline: function (req, res) {
			var worksheet = ibid.mapWorksheet(req.query);
			var baseline = ibid.getBaseline(worksheet.currentAge, worksheet.retirementAge, worksheet.numberOfPeriods, worksheet.annualDeposit, worksheet.growthRate, worksheet.rateOfReturn, worksheet.managementFee, worksheet.initialWithdrawal, worksheet.inflationRate);
			res.json(baseline);
		},

		getIbidBreakEvenAnalysis: function (req, res) {
			var worksheet = ibid.mapWorksheet(req.query);
			var breakEvenAnalysis = ibid.getBreakEvenAnalysis(worksheet.currentAge, worksheet.retirementAge, worksheet.numberOfPeriods, worksheet.annualDeposit, worksheet.growthRate, worksheet.rateOfReturn, worksheet.managementFee, worksheet.insuranceProductIncome, worksheet.initialWithdrawal, worksheet.inflationRate);
			res.json(breakEvenAnalysis);
		},

		getIbidReport: function (req, res) {
			var worksheet = ibid.mapWorksheet(req.query);
			var breakEvenAnalysis = ibid.getBreakEvenAnalysis(worksheet.currentAge, worksheet.retirementAge, worksheet.numberOfPeriods, worksheet.annualDeposit, worksheet.growthRate, worksheet.rateOfReturn, worksheet.managementFee, worksheet.insuranceProductIncome, worksheet.initialWithdrawal, worksheet.inflationRate);
			res.locals.package = 'dc-max';
			res.locals.worksheet = worksheet;
			res.locals.breakEvenAnalysis = breakEvenAnalysis;
			DcMax.render(
				'ibid-report'
				, res.locals
				, function (err, html) {
					res.send(html);
				});
		},

		getIbidPdf: function (req, res) {
			var rawQuerystring = querystring.stringify(req.query);
			var reportFileName = 'ibid-report.pdf';
			var reportUrl = req.protocol + '://' + req.get('host') + '/api/dc-max/ibid/report?' + rawQuerystring;
			var phantomOptions = ['--ignore-ssl-errors=yes', '--ssl-protocol=any'];
			var reportOptions = {
				viewportSize: {
					width: 1575,
					height: 1650
				},
				paperSize: {
					format: 'A4',
					orientation: 'portrait',
					border: '1in'
				},
				url: reportUrl,
				fileName: reportFileName,
				outputDirectory: outputDirectory,
				timeout: 2000
			};

			createPhantomSession(phantomOptions, function (error, _session) {
				if (error) {
					res.send(500, error);
				}

				renderPdf(_session, reportOptions, function (error, filename) {
					if (error) {
						res.send(500, error);
					}

					if (!filename) {
						res.send(404);
					}

					res.download(filename);
				});
			});
		}

	};
};
