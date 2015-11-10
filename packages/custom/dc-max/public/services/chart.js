'use strict';

var app = angular.module('mean.dc-max');
app.factory('ChartFactory', ChartFactory);

function ChartFactory($filter) {
	var chartFactory = {};

	chartFactory.getBaselineChart = function (categories, seriesA) {
		return {
			legend: {
				enabled: false
			},
			title: {
				text: '4% Rule Baseline'
			},
			chart: {
				type: 'line'
			},
			xAxis: {
				categories: categories
			},
			yAxis: {
				floor: 0
			},
			tooltip: {
				formatter: function () {
					return '<b>Age: ' + this.x + '</b><br/>' + this.series.name + ': ' + $filter('currency')(this.y, '$', 0);
				}
			},
			series: [{
				name: '4% Rule',
				data: seriesA
			}]
		};
	};

	chartFactory.getBreakEvenAnalysisChart = function (categories, seriesA, seriesB) {
		return {
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			},
			title: {
				text: 'Break-even Analysis'
			},
			chart: {
				type: 'line'
			},
			xAxis: {
				categories: categories
			},
			yAxis: {
				floor: 0
			},
			tooltip: {
				formatter: function () {
					return '<b>Age: ' + this.x + '</b><br/>' + this.series.name + ': ' + $filter('currency')(this.y, '$', 0);
				}
			},
			series: [{
				name: '4% Rule',
				data: seriesA
			}, {
				name: 'Annuity',
				data: seriesB
			}]
		};
	};

	chartFactory.getCumulativePayoutChart = function (categories, seriesA, seriesB) {
		return {
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			},
			title: {
				text: 'Cumulative Payout '
			},
			chart: {
				type: 'column'
			},
			xAxis: {
				categories: categories
			},
			yAxis: {
				floor: 0,
				title: {
					text: 'Payout $'
				}
			},
			tooltip: {
				formatter: function () {
					return '<b>' + this.key + '</b><br/>' + this.series.name + ': ' + $filter('currency')(this.y, '$', 0);
				}
			},
			plotOptions: {
				column: {
					stacking: 'normal'
				}
			},
			series: [{
				name: '4% Rule',
				data: seriesA,
				stack: 'investmentIncome'
			}, {
				name: 'Annuity',
				data: seriesB,
				stack: 'insuranceProductIncome'
			}]
		};
	};

	return chartFactory;
}
