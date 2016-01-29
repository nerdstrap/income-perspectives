'use strict';

function AbidController($scope, $rootScope, focus, AbidFactory, ChartFactory, AuthFactory, StripeFactory) {

	var vm = this;

	vm.view = {
		title: 'Index Annuity',
		parentSref: 'home',
		parentTitle: 'Home'
	};

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
		cumulativePayoutVisible: false,
		pdfDownloaded: false,
		advancedOptionsDisabled: true
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
		if (vm.abidFrm.currentAge.$valid && vm.abidFrm.retirementAge.$valid && vm.abidFrm.numberOfPeriods.$valid && vm.abidFrm.initialDeposit.$valid && vm.abidFrm.rateOfReturn.$valid && vm.abidFrm.managementFee.$valid) {
			if (worksheet.rateOfReturn >= 1 || worksheet.rateOfReturn <= -1) {
				worksheet.rateOfReturn = worksheet.rateOfReturn / 100;
			}
			if (worksheet.managementFee >= 1 || worksheet.managementFee <= -1) {
				worksheet.managementFee = worksheet.managementFee / 100;
			}
			AbidFactory.getBaseline(worksheet)
				.success(function (data) {
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

					vm.baseline = angular.copy(data);
					vm.baselineChart = ChartFactory.getBaselineChart(vm.baseline.baselineSeriesData.categories, vm.baseline.baselineSeriesData.seriesA);
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
				.success(function (data) {
					vm.status.firstOpen = false;
					vm.status.secondOpen = false;
					vm.status.thirdOpen = true;
					vm.status.baselineActive = false;
					vm.status.baselineVisible = true;
					vm.status.breakEvenAnalysisActive = true;
					vm.status.breakEvenAnalysisVisible = true;
					vm.status.cumulativePayoutActive = false;
					vm.status.cumulativePayoutVisible = true;

					vm.breakEvenAnalysis = angular.copy(data);
					vm.breakEvenAnalysisChart = ChartFactory.getBreakEvenAnalysisChart(vm.breakEvenAnalysis.breakEvenSeriesData.categories, vm.breakEvenAnalysis.breakEvenSeriesData.seriesA, vm.breakEvenAnalysis.breakEvenSeriesData.seriesB);
					vm.cumulativePayoutChart = ChartFactory.getCumulativePayoutChart(vm.breakEvenAnalysis.periodicSeriesData.categories, vm.breakEvenAnalysis.periodicSeriesData.seriesA, vm.breakEvenAnalysis.periodicSeriesData.seriesB);
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
			vm.status.getPdfDisabled = true;
			AbidFactory.getPdf(worksheet)
				.success(function (data) {
					vm.status.getPdfDisabled = false;
					var blob = new Blob([data], {type: 'application/pdf'});
					saveAs(blob, 'abidReport.pdf');
					//vm.pdfUrl = (window.URL || window.webkitURL).createObjectURL(blob);
				})
				.error(function (error) {
					vm.status.getPdfDisabled = false;
					console.log(error);
					vm.status.response = 'Unable to get pdf.';
				});
		}
	}

	function init() {
		vm.user = AuthFactory;
		if (vm.user.authenticated) {
			StripeFactory.getCustomer().success(function (response) {
				//if (response && response.plan) {
				vm.status.advancedOptionsDisabled = false;
				//}
			});
		}
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
		vm.status.pdfDownloaded = false;
		vm.status.advancedOptionsDisabled = true;
		$rootScope.$emit('updateviewheader', {
			title: 'Index Annuity',
			parentSref: 'home',
			parentTitle: 'Home'
		});
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
