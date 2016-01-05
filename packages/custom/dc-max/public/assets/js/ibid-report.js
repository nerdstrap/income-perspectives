function currency(val) {
	return '$' + val.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

var IbidReport = function () {
	return {

		renderWorksheet: function (currentAge, retirementAge, numberOfPeriods, annualDeposit, growthRate, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate, clientName, insuranceCompany) {
			$('#current-age-label').text(currentAge);
			$('#retirement-age-label').text(retirementAge);
			$('#number-of-periods-label').text(numberOfPeriods);
			var payoffAge = retirementAge + numberOfPeriods;
			$('#payoff-age-label').text(payoffAge);
			$('#annual-deposit-label').text(currency(annualDeposit));
			$('#growth-rate-label').text(growthRate.toFixed(2));
			$('#rate-of-return-label').text(rateOfReturn.toFixed(2));
			$('#management-fee-label').text(managementFee.toFixed(2));
			var netRateOfReturn = rateOfReturn - managementFee;
			$('#net-rate-of-return-label').text(netRateOfReturn.toFixed(2));
			$('#insurance-product-income-label').text(currency(insuranceProductIncome));
			$('#initial-withdrawal-label').text(initialWithdrawal.toFixed(2));
			$('#inflation-rate-label').text(inflationRate.toFixed(2));
			$('#client-name-label').text(clientName);
			$('#insurance-company-label').text(insuranceCompany);
		},

		renderBreakEvenAnalysisChart: function (categories, seriesA, seriesB) {
			$('#break-even-analysis-chart').highcharts({
				title: {
					text: 'Break-even Analysis'
				},
				chart: {
					type: 'line',
					height: 600,
					width: 975
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
					enabled: false
				},
				series: [{
					animation: false,
					name: '4% Rule',
					data: seriesA
				}, {
					animation: false,
					name: 'Index UL',
					data: seriesB
				}]
			});
		},

		renderCumulativePayoutChart: function (categories, seriesA, seriesB) {
			$('#cumulative-payout-chart').highcharts({
				title: {
					text: 'Cumulative Payout '
				},
				chart: {
					type: 'column',
					height: 600,
					width: 975
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
					enabled: false
				},
				series: [{
					animation: false,
					name: '4% Rule',
					data: seriesA,
					stack: 'investmentIncome'
				}, {
					animation: false,
					name: 'Index UL',
					data: seriesB,
					stack: 'insuranceProductIncome'
				}]
			});
		},

		renderPeriodicPayouts: function (gogoPayouts, slowgoPayouts, nogoPayouts) {

		},

		init: function (currentAge, retirementAge, numberOfPeriods, annualDeposit, growthRate, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate, clientName, insuranceCompany, categories, seriesA, seriesB, breakEvenAge, cumulativePayoutCategories, cumulativePayoutSeriesA, cumulativePayoutSeriesB, gogoPayouts, slowgoPayouts, nogoPayouts) {
			this.renderWorksheet(currentAge, retirementAge, numberOfPeriods, annualDeposit, growthRate, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate, clientName, insuranceCompany);
			this.renderBreakEvenAnalysisChart(categories, seriesA, seriesB);
			this.renderCumulativePayoutChart(cumulativePayoutCategories, cumulativePayoutSeriesA, cumulativePayoutSeriesB);
			this.renderPeriodicPayouts(gogoPayouts, slowgoPayouts, nogoPayouts);
		}

	};
}();
