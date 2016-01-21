function currency(val) {
	return '$' + val.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

var AbidReport = function () {
	return {

		renderWorksheet: function (currentAge, retirementAge, numberOfPeriods, initialDeposit, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate, clientName, insuranceCompany) {
			$('#client-name-input').val(clientName);
			$('#insurance-company-input').val(insuranceCompany);
			$('#current-age-input').val(currentAge);
			$('#retirement-age-input').val(retirementAge);
			$('#number-of-periods-input').val(numberOfPeriods);
			//var payoffAge = retirementAge + numberOfPeriods;
			//$('#payoff-age-input').val(payoffAge);
			$('#initial-deposit-input').val(initialDeposit);
			$('#rate-of-return-input').val(rateOfReturn.toFixed(2));
			$('#management-fee-input').val(managementFee.toFixed(2));
			//var netRateOfReturn = rateOfReturn - managementFee;
			//$('#net-rate-of-return-input').val(netRateOfReturn.toFixed(2));
			$('#insurance-product-income-input').val(insuranceProductIncome);
			$('#initial-withdrawal-input').val(initialWithdrawal.toFixed(2));
			$('#inflation-rate-input').val(inflationRate.toFixed(2));
		},

		renderBaselineData: function (investmentIncome, rateOfReturn) {
			$('#baseline-investment-income-input').val(investmentIncome);
			$('#baseline-rate-of-return-input').val(rateOfReturn.toFixed(2));
		},

		renderBaselineChart: function (categories, seriesA) {
			$('#baseline-chart').highcharts({
				legend: {
					enabled: false
				},
				title: {
					text: null
				},
				chart: {
					type: 'line',
					height: 400,
					width: 780
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
						return '<b>Age: ' + this.x + '</b><br/>' + this.series.name + ': ' + currency(this.y);
					}
				},
				series: [{
					name: '4% Rule',
					data: seriesA,
					color: '#95a5a6'
				}]
			});
		},

		renderBreakEvenAnalysisData: function (insuranceProducIncome, investmentIncome, incomeDifferential, rateOfReturn, breakEvenAge) {
			$('#break-even-investment-income-input').val(investmentIncome);
			$('#break-even-insurance-product-income-input').val(insuranceProducIncome);
			$('#break-even-income-differential-input').val(incomeDifferential);
			$('#break-even-rate-of-return-input').val(rateOfReturn.toFixed(2));
			$('#break-even-age-input').val(breakEvenAge);
		},

		renderBreakEvenAnalysisChart: function (categories, seriesA, seriesB) {
			$('#break-even-analysis-chart').highcharts({
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
					width: 780
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
						return '<b>Age: ' + this.x + '</b><br/>' + this.series.name + ': ' + currency(this.y);
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
			});
		},

		renderPeriodicData: function (insuranceProducIncome, investmentIncome, incomeDifferential, rateOfReturn) {
			$('#periodic-investment-income-input').val(investmentIncome);
			$('#periodic-insurance-product-income-input').val(insuranceProducIncome);
			$('#periodic-income-differential-input').val(incomeDifferential);
			$('#periodic-rate-of-return-input').val(rateOfReturn.toFixed(2));
		},

		renderPeriodicChart: function (categories, seriesA, seriesB) {
			$('#periodic-chart').highcharts({
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
					width: 780
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
						return '<b>' + this.key + '</b><br/>' + this.series.name + ': ' + currency(this.y);
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
			});
		},

		renderPeriodicPayouts: function (gogoPayouts, gogoIncomeDifferential, slowgoPayouts, slowgoIncomeDifferential, nogoPayouts, nogoIncomeDifferential) {
			var g = 0;
			var gogoPayoutRows = '';
			while (g < gogoPayouts.length) {
				var age = gogoPayouts[g].age;
				var cumulativeInsuranceProductIncome = currency(gogoPayouts[g].cumulativeInsuranceProductIncome);
				var cumulativeInvestmentIncome = currency(gogoPayouts[g].cumulativeInvestmentIncome);
				gogoPayoutRows += '<tr><th scope="row">' + age + '</th><td class="col-md-4">' + cumulativeInvestmentIncome + '</td><td>' + cumulativeInsuranceProductIncome + '</td></tr>';
				g++;
			}
			$('#gogo-payout-rows').html(gogoPayoutRows);
			$('#gogo-income-differential-label').text(gogoIncomeDifferential);

			var s = 0;
			var slowgoPayoutRows = '';
			while (s < slowgoPayouts.length) {
				var age = slowgoPayouts[s].age;
				var cumulativeInsuranceProductIncome = currency(slowgoPayouts[s].cumulativeInsuranceProductIncome);
				var cumulativeInvestmentIncome = currency(slowgoPayouts[s].cumulativeInvestmentIncome);
				slowgoPayoutRows += '<tr><th scope="row">' + age + '</th><td class="col-md-4">' + cumulativeInvestmentIncome + '</td><td>' + cumulativeInsuranceProductIncome + '</td></tr>';
				s++;
			}
			$('#slowgo-payout-rows').html(slowgoPayoutRows);
			$('#slowgo-income-differential-label').text(slowgoIncomeDifferential);

			var n = 0;
			var nogoPayoutRows = '';
			while (n < nogoPayouts.length) {
				var age = nogoPayouts[n].age;
				var cumulativeInsuranceProductIncome = currency(nogoPayouts[n].cumulativeInsuranceProductIncome);
				var cumulativeInvestmentIncome = currency(nogoPayouts[n].cumulativeInvestmentIncome);
				nogoPayoutRows += '<tr><th scope="row">' + age + '</th><td class="col-md-4">' + cumulativeInvestmentIncome + '</td><td>' + cumulativeInsuranceProductIncome + '</td></tr>';
				n++;
			}
			$('#nogo-payout-rows').html(nogoPayoutRows);
			$('#nogo-income-differential-label').text(nogoIncomeDifferential);
		},

		init: function (currentAge, retirementAge, numberOfPeriods, initialDeposit, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate, clientName, insuranceCompany, firstPayout, breakEvenSeriesData, firstPeriodicPayout, periodicSeriesData, gogoPayouts, slowgoPayouts, nogoPayouts, breakEvenAge) {
			this.renderWorksheet(currentAge, retirementAge, numberOfPeriods, initialDeposit, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate, clientName, insuranceCompany);

			this.renderBaselineData(firstPayout.cumulativeInvestmentIncome, rateOfReturn);
			this.renderBaselineChart(breakEvenSeriesData.categories, breakEvenSeriesData.seriesA);

			this.renderBreakEvenAnalysisData(firstPayout.cumulativeInsuranceProductIncome, firstPayout.cumulativeInvestmentIncome, firstPayout.cumulativeIncomeDifferential, rateOfReturn);
			this.renderBreakEvenAnalysisChart(breakEvenSeriesData.categories, breakEvenSeriesData.seriesA, breakEvenSeriesData.seriesB, breakEvenSeriesData.seriesC);

			this.renderPeriodicData(firstPeriodicPayout.cumulativeInsuranceProductIncome, firstPeriodicPayout.cumulativeInvestmentIncome, firstPeriodicPayout.cumulativeIncomeDifferential, rateOfReturn);
			this.renderPeriodicChart(periodicSeriesData.categories, periodicSeriesData.seriesA, periodicSeriesData.seriesB, periodicSeriesData.seriesC);

			this.renderPeriodicPayouts(gogoPayouts, periodicSeriesData.seriesC[0], slowgoPayouts, periodicSeriesData.seriesC[1], nogoPayouts, periodicSeriesData.seriesC[2]);
		}

	};
}();
