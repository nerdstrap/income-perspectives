function currency(val) {
	return '$' + val.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

var AbidReport = function () {
	return {

		renderWorksheet: function (currentAge, retirementAge, numberOfPeriods, initialDeposit, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate, clientName, insuranceCompany) {
			$('#current-age-label').text(currentAge);
			$('#retirement-age-label').text(retirementAge);
			$('#number-of-periods-label').text(numberOfPeriods);
			var payoffAge = retirementAge + numberOfPeriods;
			$('#payoff-age-label').text(payoffAge);
			$('#initial-deposit-label').text(currency(initialDeposit));
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

		renderBreakEvenAnalysisData: function (breakEvenMessage) {
			$('#breakeven-age-label').text(breakEvenMessage);
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
					name: 'Annuity',
					data: seriesB
				}]
			});
		},

		renderCumulativePayoutData: function (seriesA0, seriesB0, grossRateOfReturn) {
			$('#cumulative-insurance-product-income-0-label').text(currency(seriesB0));
			$('#cumulative-investment-income-0-label').text(currency(seriesA0));
			$('.gross-rate-of-return-label').text('Based on ' + (grossRateOfReturn * 100).toFixed(0) + '% ROR');
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
					name: 'Annuity',
					data: seriesB,
					stack: 'insuranceProductIncome'
				}]
			});
		},

		renderPeriodicPayouts: function (gogoPayouts, slowgoPayouts, nogoPayouts) {
			var g = 0;
			var gogoTable = "<div class='row'><div class='col-xs-12'><h4>Go Go (First " + gogoPayouts.length + " years)</h4></div></div>";
			while (g < gogoPayouts.length) {
				var age = gogoPayouts[g].age;
				var cumulativeInsuranceProductIncome = currency(gogoPayouts[g].cumulativeInsuranceProductIncome);
				var cumulativeInvestmentIncome = currency(gogoPayouts[g].cumulativeInvestmentIncome);
				gogoTable += "<div class='row'><div class='col-xs-4'>" + age + "</div><div class='col-xs-4'>" + cumulativeInvestmentIncome + "</div><div class='col-xs-4'>" + cumulativeInsuranceProductIncome + "</div></div>";
				g++;
			}
			$('#go-go-schedule').html(gogoTable);

			var s = 0;
			var slowgoTable = "<div class='row'><div class='col-xs-12'><h4>Slow Go (Middle " + slowgoPayouts.length + " years)</h4></div></div>";
			while (s < slowgoPayouts.length) {
				var age = slowgoPayouts[s].age;
				var cumulativeInsuranceProductIncome = currency(slowgoPayouts[s].cumulativeInsuranceProductIncome);
				var cumulativeInvestmentIncome = currency(slowgoPayouts[s].cumulativeInvestmentIncome);
				slowgoTable += "<div class='row'><div class='col-xs-4'>" + age + "</div><div class='col-xs-4'>" + cumulativeInvestmentIncome + "</div><div class='col-xs-4'>" + cumulativeInsuranceProductIncome + "</div></div>";
				s++;
			}
			$('#slow-go-schedule').html(slowgoTable);

			var n = 0;
			var nogoTable = "<div class='row'><div class='col-xs-12'><h4>No Go (Final " + nogoPayouts.length + " years)</h4></div></div>";
			while (n < nogoPayouts.length) {
				var age = nogoPayouts[n].age;
				var cumulativeInsuranceProductIncome = currency(nogoPayouts[n].cumulativeInsuranceProductIncome);
				var cumulativeInvestmentIncome = currency(nogoPayouts[n].cumulativeInvestmentIncome);
				nogoTable += "<div class='row'><div class='col-xs-4'>" + age + "</div><div class='col-xs-4'>" + cumulativeInvestmentIncome + "</div><div class='col-xs-4'>" + cumulativeInsuranceProductIncome + "</div></div>";
				n++;
			}
			$('#no-go-schedule').html(nogoTable);
		},

		init: function (currentAge, retirementAge, numberOfPeriods, initialDeposit, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate, clientName, insuranceCompany, categories, seriesA, seriesB, breakEvenMessage, cumulativePayoutCategories, cumulativePayoutSeriesA, cumulativePayoutSeriesB, gogoPayouts, slowgoPayouts, nogoPayouts) {
			this.renderWorksheet(currentAge, retirementAge, numberOfPeriods, initialDeposit, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate, clientName, insuranceCompany);
			this.renderBreakEvenAnalysisData(breakEvenMessage);
			this.renderBreakEvenAnalysisChart(cumulativePayoutCategories, cumulativePayoutSeriesA, cumulativePayoutSeriesB);
			this.renderCumulativePayoutData(cumulativePayoutSeriesA[0], cumulativePayoutSeriesB[0], rateOfReturn);
			this.renderCumulativePayoutChart(cumulativePayoutCategories, cumulativePayoutSeriesA, cumulativePayoutSeriesB);
			this.renderPeriodicPayouts(gogoPayouts, slowgoPayouts, nogoPayouts);
		}

	};
}();
