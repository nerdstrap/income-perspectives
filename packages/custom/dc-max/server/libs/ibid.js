'use strict';
var _ = require('lodash-contrib');

var getFutureValueWithGrowth = function (initialValue, rateOfReturn, growthRate, numberOfPeriods) {
	return initialValue * ((Math.pow(1.0 + rateOfReturn, numberOfPeriods) - Math.pow(1.0 + growthRate, numberOfPeriods)) / (rateOfReturn - growthRate));

};

var getPresentValue = function (futureValue, rateOfReturn, numberOfPeriods) {
	return futureValue / Math.pow((1.0 + rateOfReturn), numberOfPeriods);
};

module.exports.mapWorksheet = function (source) {
	return {
		currentAge: parseInt(source.currentAge, 10),
		retirementAge: parseInt(source.retirementAge, 10),
		numberOfPeriods: parseInt(source.numberOfPeriods, 10),
		annualDeposit: parseFloat(source.annualDeposit),
		growthRate: parseFloat(source.growthRate),
		rateOfReturn: parseFloat(source.rateOfReturn),
		managementFee: parseFloat(source.managementFee),
		insuranceProductIncome: parseFloat(source.insuranceProductIncome),
		initialWithdrawal: parseFloat(source.initialWithdrawal),
		inflationRate: parseFloat(source.inflationRate),
		clientName: source.clientName,
		insuranceCompany: source.insuranceCompany
	};
};

module.exports.getBaseline = function (currentAge, retirementAge, numberOfPeriods, annualDeposit, growthRate, rateOfReturn, managementFee, initialWithdrawal, inflationRate) {
	var yearsUntilRetirement = retirementAge - currentAge;
	var yearsCompounded = yearsUntilRetirement;
	var netRateOfReturn = rateOfReturn - managementFee;
	var annualRateOfReturn = 1.0 + rateOfReturn;
	var annualInflationRate = 1.0 + inflationRate;

	var accountValue = getFutureValueWithGrowth(annualDeposit, netRateOfReturn, growthRate, yearsUntilRetirement);
	var annualWithdrawal = accountValue * initialWithdrawal;
	var accountValueAfterAnnualWithdrawal = accountValue - annualWithdrawal;
	var accountValueAtEndOfYear = accountValueAfterAnnualWithdrawal * annualRateOfReturn;
	var cumulativeInvestmentIncome = annualWithdrawal;
	var presentValueOfInvestmentIncome = getPresentValue(annualWithdrawal, rateOfReturn, yearsCompounded);
	var cumulativePresentValueOfInvestmentIncome = presentValueOfInvestmentIncome;

	var age = retirementAge;
	var index = -1;
	var payouts = new Array(numberOfPeriods);
	payouts[++index] = {
		age: age,
		cumulativeInvestmentIncome: Math.floor(cumulativeInvestmentIncome)
	};
	while (++index <= numberOfPeriods) {
		age = age + 1;
		yearsCompounded = yearsCompounded + 1;

		accountValue = accountValueAtEndOfYear;
		annualWithdrawal *= annualInflationRate;
		accountValueAfterAnnualWithdrawal = accountValue - annualWithdrawal;
		accountValueAtEndOfYear = accountValueAfterAnnualWithdrawal * annualRateOfReturn;
		cumulativeInvestmentIncome += annualWithdrawal;
		presentValueOfInvestmentIncome = getPresentValue(annualWithdrawal, rateOfReturn, yearsCompounded);
		cumulativePresentValueOfInvestmentIncome += presentValueOfInvestmentIncome;

		payouts[index] = {
			age: age,
			cumulativeInvestmentIncome: Math.floor(cumulativeInvestmentIncome)
		}
	}

	var grossRateOfReturn = Math.floor(rateOfReturn * 100);

	var firstPayout = _.first(payouts);

	var baselineSeriesData = {};
	baselineSeriesData.categories = _.pluck(payouts, 'age');
	baselineSeriesData.seriesA = _.pluck(payouts, 'cumulativeInvestmentIncome');

	return {
		grossRateOfReturn: grossRateOfReturn,
		firstPayout: firstPayout,
		baselineSeriesData: baselineSeriesData
	};
};

module.exports.getBreakEvenAnalysis = function (currentAge, retirementAge, numberOfPeriods, annualDeposit, growthRate, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate) {
	var yearsUntilRetirement = retirementAge - currentAge;
	var yearsCompounded = yearsUntilRetirement;
	var chunkSize = Math.floor(numberOfPeriods / 3);
	var netRateOfReturn = rateOfReturn - managementFee;
	var annualRateOfReturn = 1.0 + rateOfReturn;
	var annualInflationRate = 1.0 + inflationRate;

	var breakEvenAge = retirementAge;
	var breakEvenAgeSet = false;

	var accountValue = getFutureValueWithGrowth(annualDeposit, netRateOfReturn, growthRate, yearsUntilRetirement);
	var annualWithdrawal = accountValue * initialWithdrawal;
	var accountValueAfterAnnualWithdrawal = accountValue - annualWithdrawal;
	var accountValueAtEndOfYear = accountValueAfterAnnualWithdrawal * annualRateOfReturn;
	var cumulativeInvestmentIncome = annualWithdrawal;
	var presentValueOfInsuranceProductIncome = getPresentValue(insuranceProductIncome, rateOfReturn, yearsCompounded);
	var cumulativePresentValueOfInsuranceProductIncome = presentValueOfInsuranceProductIncome;
	var cumulativeInsuranceProductIncome = insuranceProductIncome;
	var presentValueOfInvestmentIncome = getPresentValue(annualWithdrawal, rateOfReturn, yearsCompounded);
	var cumulativePresentValueOfInvestmentIncome = presentValueOfInvestmentIncome;
	var cumulativeIncomeDifferential = (cumulativeInsuranceProductIncome / cumulativeInvestmentIncome - 1) * 100;

	if (cumulativeInvestmentIncome > cumulativeInsuranceProductIncome) {
		breakEvenAgeSet = true;
	}

	var age = retirementAge;
	var index = 0;
	var payouts = new Array(numberOfPeriods);

	payouts[index] = {
		age: age,
		cumulativeInvestmentIncome: Math.floor(cumulativeInvestmentIncome),
		cumulativeInsuranceProductIncome: Math.floor(cumulativeInsuranceProductIncome),
		cumulativeIncomeDifferential: Math.floor(cumulativeIncomeDifferential)
	};

	while (++index < numberOfPeriods) {
		age += 1;
		yearsCompounded += 1;

		accountValue = accountValueAtEndOfYear;
		annualWithdrawal *= annualInflationRate;
		if (accountValue < annualWithdrawal) {
			annualWithdrawal = accountValue;
		}
		accountValueAfterAnnualWithdrawal = accountValue - annualWithdrawal;
		accountValueAtEndOfYear = accountValueAfterAnnualWithdrawal * annualRateOfReturn;
		cumulativeInvestmentIncome += annualWithdrawal;
		presentValueOfInsuranceProductIncome = getPresentValue(insuranceProductIncome, rateOfReturn, yearsCompounded);
		cumulativePresentValueOfInsuranceProductIncome += presentValueOfInsuranceProductIncome;
		cumulativeInsuranceProductIncome += insuranceProductIncome;
		presentValueOfInvestmentIncome = getPresentValue(annualWithdrawal, rateOfReturn, yearsCompounded);
		cumulativePresentValueOfInvestmentIncome += presentValueOfInvestmentIncome;
		cumulativeIncomeDifferential = (cumulativeInsuranceProductIncome / cumulativeInvestmentIncome - 1) * 100;

		payouts[index] = {
			age: age,
			cumulativeInvestmentIncome: Math.floor(cumulativeInvestmentIncome),
			cumulativeInsuranceProductIncome: Math.floor(cumulativeInsuranceProductIncome),
			cumulativeIncomeDifferential: Math.floor(cumulativeIncomeDifferential)
		};

		if (!breakEvenAgeSet && cumulativeInvestmentIncome > cumulativeInsuranceProductIncome) {
			breakEvenAge = age;
			breakEvenAgeSet = true;
		}
	}

	var grossRateOfReturn = Math.floor(rateOfReturn * 100);

	var firstPayout = _.first(payouts);

	var breakEvenSeriesData = {};
	breakEvenSeriesData.categories = _.pluck(payouts, 'age');
	breakEvenSeriesData.seriesA = _.pluck(payouts, 'cumulativeInvestmentIncome');
	breakEvenSeriesData.seriesB = _.pluck(payouts, 'cumulativeInsuranceProductIncome');
	breakEvenSeriesData.seriesC = _.pluck(payouts, 'cumulativeIncomeDifferential');

	var split1Payouts = _.splitAt(payouts, chunkSize);
	var split2Payouts = _.splitAt(split1Payouts[1], chunkSize);

	var gogoPayouts = split1Payouts[0];
	var slowgoPayouts = split2Payouts[0];
	var nogoPayouts = split2Payouts[1];

	var lastGogoPayout = _.last(gogoPayouts);
	var lastSlowgoPayout = _.last(slowgoPayouts);
	var lastNogoPayout = _.last(nogoPayouts);

	var periodicPayouts = [lastGogoPayout, lastSlowgoPayout, lastNogoPayout];

	var gogoCategoryLabel = 'Go-Go (through ' + gogoPayouts.length + ' years)|' + lastGogoPayout.cumulativeIncomeDifferential + '% Advantage';
	var slowgoCategoryLabel = 'Slow-Go (through ' + (gogoPayouts.length + slowgoPayouts.length) + ' years)|' + lastSlowgoPayout.cumulativeIncomeDifferential + '% Advantage';
	var nogoCategoryLabel = 'No-Go (through ' + payouts.length + ' years)|' + lastNogoPayout.cumulativeIncomeDifferential + '% Advantage';

	var periodicAnalysis = {};
	periodicAnalysis.categories = [gogoCategoryLabel, slowgoCategoryLabel, nogoCategoryLabel];
	periodicAnalysis.seriesA = _.pluck(periodicPayouts, 'cumulativeInvestmentIncome');
	periodicAnalysis.seriesB = _.pluck(periodicPayouts, 'cumulativeInsuranceProductIncome');
	periodicAnalysis.seriesC = _.pluck(periodicPayouts, 'cumulativeIncomeDifferential');

	var response = {
		grossRateOfReturn: grossRateOfReturn,
		firstPayout: firstPayout,
		breakEvenSeriesData: breakEvenSeriesData,
		firstPeriodicPayout: lastGogoPayout,
		periodicSeriesData: periodicAnalysis,
		gogoPayouts: gogoPayouts,
		slowgoPayouts: slowgoPayouts,
		nogoPayouts: nogoPayouts
	};
	if (breakEvenAgeSet) {
		response.breakEvenAge = breakEvenAge;
	}

	return response;
};
