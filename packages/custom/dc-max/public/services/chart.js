'use strict';

function ChartFactory($filter) {
	var chartFactory = {};

	chartFactory.getBaselineChart = function (categories, seriesA) {
		return {
			legend: {
				enabled: false
			},
			title: {
				text: null
			},
			chart: {
				type: 'line',
				height: 400,
				width: 688
			},
			credits: {
				enabled: false
			},
			xAxis: {
				categories: categories,
				title: {
					text: 'Age',
					style: {
						fontWeight: 'bold'
					}
				}
			},
			yAxis: {
				floor: 0,
				title: {
					text: 'Cumulative Payout',
					style: {
						fontWeight: 'bold'
					}
				}
			},
			tooltip: {
				formatter: function () {
					return '<b>Age: ' + this.x + '</b><br/>' + this.series.name + ': ' + $filter('currency')(this.y, '$', 0);
				}
			},
			series: [{
				name: '4% Rule',
				data: seriesA,
				color: '#95a5a6'
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
				text: null
			},
			credits: {
				enabled: false
			},
			chart: {
				type: 'line',
				height: 400,
				width: 688
			},
			xAxis: {
				categories: categories,
				title: {
					text: 'Age',
					style: {
						fontWeight: 'bold'
					}
				}
			},
			yAxis: {
				floor: 0,
				title: {
					text: 'Cumulative Payout',
					style: {
						fontWeight: 'bold'
					}
				}
			},
			tooltip: {
				formatter: function () {
					return '<b>Age: ' + this.x + '</b><br/>' + this.series.name + ': ' + $filter('currency')(this.y, '$', 0);
				}
			},
			series: [{
				name: '4% Rule',
				data: seriesA,
				color: '#95a5a6',
				marker: {
					symbol: 'circle'
				}
			}, {
				name: 'Annuity',
				data: seriesB,
				color: '#72c02c',
				marker: {
					symbol: 'circle'
				}
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
				text: null
			},
			chart: {
				type: 'column',
				height: 400,
				width: 688
			},
			credits: {
				enabled: false
			},
			xAxis: {
				categories: categories,
				title: {
					text: null
				},
				labels: {
					formatter: function () {
						var lines = this.value.split('|');
						return lines[0] + '<br/>' + lines[1];
					}
				}
			},
			yAxis: {
				floor: 0,
				title: {
					text: 'Cumulative Payout',
					style: {
						fontWeight: 'bold'
					}
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
				stack: 'investmentIncome',
				color: '#95a5a6'
			}, {
				name: 'Annuity',
				data: seriesB,
				stack: 'insuranceProductIncome',
				color: '#72c02c'
			}]
		};
	};

	return chartFactory;
}

var app = angular.module('mean.dc-max');
app.factory('ChartFactory', ChartFactory);
