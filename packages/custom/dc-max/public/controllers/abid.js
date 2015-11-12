'use strict';

function AbidController($scope, $rootScope, AbidFactory, ChartFactory, focus, $window) {
	var vm = this;

	vm.master = {
		numberOfPeriods: 30,
		initialWithdrawal: 0.04,
		inflationRate: 0.03
	};
	vm.baselineMaster = {};
	vm.breakEvenAnalysisMaster = {};

	vm.status = {
		firstOpen: true,
		secondOpen: false,
		thirdOpen: false,
		baselineActive: false,
		baselineVisible: false,
		breakEvenAnalysisActive: false,
		breakEvenAnalysisVisible: false,
		cumulativePayoutActive: false,
		cumulativePayoutVisible: false
	};

	function updateGeneral(worksheet) {
		if (vm.abidFrm.currentAge.$valid && vm.abidFrm.retirementAge.$valid && vm.abidFrm.numberOfPeriods.$valid) {
			vm.status.firstOpen = false;
			vm.status.secondOpen = true;
			focus('secondOpened');
			vm.status.thirdOpen = false;
			vm.status.baselineActive = false;
			vm.status.baselineVisible = false;
			vm.status.breakEvenAnalysisActive = false;
			vm.status.breakEvenAnalysisVisible = false;
			vm.status.cumulativePayoutActive = false;
			vm.status.cumulativePayoutVisible = false;
		}
	}

	function getBaseline(worksheet) {
		if (vm.abidFrm.currentAge.$valid && vm.abidFrm.retirementAge.$valid && vm.abidFrm.numberOfPeriods.$valid) {
			if (worksheet.rateOfReturn >= 1 || worksheet.rateOfReturn <= -1) {
				worksheet.rateOfReturn = worksheet.rateOfReturn / 100;
			}
			if (worksheet.managementFee >= 1 || worksheet.managementFee <= -1) {
				worksheet.managementFee = worksheet.managementFee / 100;
			}
			AbidFactory.getBaseline(worksheet)
				.success(function (baseline) {
					vm.status.firstOpen = false;
					vm.status.secondOpen = false;
					vm.status.thirdOpen = true;
					focus('thirdOpened');
					vm.status.baselineActive = true;
					vm.status.baselineVisible = true;
					vm.status.breakEvenAnalysisActive = false;
					vm.status.breakEvenAnalysisVisible = false;
					vm.status.cumulativePayoutActive = false;
					vm.status.cumulativePayoutVisible = false;

					vm.baseline = angular.copy(baseline);
					vm.baselineChart = ChartFactory.getBaselineChart(vm.baseline.categories, vm.baseline.seriesA);
				})
				.error(function (error) {
					console.log(error);
					vm.status.response = 'Unable to get baseline.';
				});
		}
	}

	function getBreakEvenAnalysis(worksheet) {
		if (vm.abidFrm.$valid) {
			if (worksheet.initialWithdrawal >= 1 || worksheet.initialWithdrawal <= -1) {
				worksheet.initialWithdrawal = worksheet.initialWithdrawal / 100;
			}
			if (worksheet.inflationRate >= 1 || worksheet.inflationRate <= -1) {
				worksheet.inflationRate = worksheet.inflationRate / 100;
			}
			AbidFactory.getBreakEvenAnalysis(worksheet)
				.success(function (breakEvenAnalysis) {
					vm.status.firstOpen = false;
					vm.status.secondOpen = false;
					vm.status.thirdOpen = true;
					vm.status.baselineActive = false;
					vm.status.baselineVisible = true;
					vm.status.breakEvenAnalysisActive = true;
					vm.status.breakEvenAnalysisVisible = true;
					vm.status.cumulativePayoutActive = false;
					vm.status.cumulativePayoutVisible = true;

					vm.breakEvenAnalysis = angular.copy(breakEvenAnalysis);
					vm.breakEvenAnalysisChart = ChartFactory.getBreakEvenAnalysisChart(vm.breakEvenAnalysis.categories, vm.breakEvenAnalysis.seriesA, vm.breakEvenAnalysis.seriesB);
					vm.cumulativePayoutChart = ChartFactory.getCumulativePayoutChart(vm.breakEvenAnalysis.cumulativePayoutCategories, vm.breakEvenAnalysis.cumulativePayoutSeriesA, vm.breakEvenAnalysis.cumulativePayoutSeriesB);
				})
				.error(function (error) {
					console.log(error);
					vm.status.response = 'Unable to get break-even analysis.';
				});
		}
	}

	function getPdf(worksheet) {
		if (vm.abidFrm.$valid) {
			if (worksheet.initialWithdrawal >= 1 || worksheet.initialWithdrawal <= -1) {
				worksheet.initialWithdrawal = worksheet.initialWithdrawal / 100;
			}
			if (worksheet.inflationRate >= 1 || worksheet.inflationRate <= -1) {
				worksheet.inflationRate = worksheet.inflationRate / 100;
			}
			AbidFactory.getPdf(worksheet)
				.success(function (pdfContents) {
					var file = new Blob([pdfContents], {
						type: 'application/pdf'
					});
					var fileURL = URL.createObjectURL(file);
				})
				.error(function (error) {
					console.log(error);
					vm.status.response = 'Unable to get pdf.';
				});
		}
	}

	function init() {
		vm.worksheet = angular.copy(vm.master);
		vm.baseline = angular.copy(vm.baselineMaster);
		vm.breakEvenAnalysis = angular.copy(vm.breakEvenAnalysisMaster);
		vm.status.firstOpen = true;
		focus('firstOpened');
		vm.status.secondOpen = false;
		vm.status.thirdOpen = false;
		vm.status.baselineActive = false;
		vm.status.baselineVisible = false;
		vm.status.breakEvenAnalysisActive = false;
		vm.status.breakEvenAnalysisVisible = false;
		vm.status.cumulativePayoutActive = false;
		vm.status.cumulativePayoutVisible = false;
	}

	function reset() {
		vm.init();
		vm.abidFrm.$setUntouched();
		vm.abidFrm.$setPristine();
	}

	vm.updateGeneral = updateGeneral;
	vm.getBaseline = getBaseline;
	vm.getBreakEvenAnalysis = getBreakEvenAnalysis;
	vm.getPdf = getPdf;
	vm.init = init;
	vm.reset = reset;

	vm.init();
}

var app = angular.module('mean.dc-max');
app.controller('AbidController', AbidController);
