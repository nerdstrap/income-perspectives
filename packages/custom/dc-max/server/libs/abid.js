'use strict';
var _ = require('lodash-contrib');

var getFutureValue = function (presentValue, rateOfReturn, numberOfPeriods) {
	return presentValue * Math.pow((1.0 + rateOfReturn), numberOfPeriods);
};

var getPresentValue = function (futureValue, rateOfReturn, numberOfPeriods) {
	return futureValue / Math.pow((1.0 + rateOfReturn), numberOfPeriods);
};

module.exports.mapWorksheet = function (source) {
	return {
		currentAge: parseInt(source.currentAge, 10),
		retirementAge: parseInt(source.retirementAge, 10),
		numberOfPeriods: parseInt(source.numberOfPeriods, 10),
		initialDeposit: parseFloat(source.initialDeposit),
		rateOfReturn: parseFloat(source.rateOfReturn),
		managementFee: parseFloat(source.managementFee),
		insuranceProductIncome: parseFloat(source.insuranceProductIncome),
		initialWithdrawal: parseFloat(source.initialWithdrawal),
		inflationRate: parseFloat(source.inflationRate),
		clientName: source.clientName,
		insuranceCompany: source.insuranceCompany
	};
};

module.exports.getBaseline = function (currentAge, retirementAge, numberOfPeriods, initialDeposit, rateOfReturn, managementFee, initialWithdrawal, inflationRate) {
	var yearsUntilRetirement = retirementAge - currentAge;
	var yearsCompounded = yearsUntilRetirement;
	var netRateOfReturn = rateOfReturn - managementFee;
	var annualRateOfReturn = 1.0 + rateOfReturn;
	var annualInflationRate = 1.0 + inflationRate;

	var accountValue = getFutureValue(initialDeposit, netRateOfReturn, yearsUntilRetirement);
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
		age: age
		//,accountValue: accountValue
		//,annualWithdrawal: annualWithdrawal
		//,accountValueAfterAnnualWithdrawal: accountValueAfterAnnualWithdrawal
		//,accountValueAtEndOfYear: accountValueAtEndOfYear
		, cumulativeInvestmentIncome: Math.floor(cumulativeInvestmentIncome)
		//,yearsCompounded: yearsCompounded
		//,presentValueOfInvestmentIncome: presentValueOfInvestmentIncome
		//,cumulativePresentValueOfInvestmentIncome: cumulativePresentValueOfInvestmentIncome
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
			age: age
			//,accountValue: accountValue
			//,annualWithdrawal: annualWithdrawal
			//,accountValueAfterAnnualWithdrawal: accountValueAfterAnnualWithdrawal
			//,accountValueAtEndOfYear: accountValueAtEndOfYear
			, cumulativeInvestmentIncome: Math.floor(cumulativeInvestmentIncome)
			//,yearsCompounded: yearsCompounded
			//,presentValueOfInvestmentIncome: presentValueOfInvestmentIncome
			//,cumulativePresentValueOfInvestmentIncome: cumulativePresentValueOfInvestmentIncome
		}
	}

	var investmentIncome = payouts[0].cumulativeInvestmentIncome;
	var categories = _.pluck(payouts, 'age');
	var seriesA = _.pluck(payouts, 'cumulativeInvestmentIncome');
	var rateOfReturnMessage = 'Based on ' + Math.floor(rateOfReturn * 100) + '% ROR';

	return {
		investmentIncome: investmentIncome,
		rateOfReturnMessage: rateOfReturnMessage,
		categories: categories,
		seriesA: seriesA
	};
};

module.exports.getBreakEvenAnalysis = function (currentAge, retirementAge, numberOfPeriods, initialDeposit, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate) {
	var yearsUntilRetirement = retirementAge - currentAge;
	var yearsCompounded = yearsUntilRetirement;
	var chunkSize = Math.floor(numberOfPeriods / 3);
	var netRateOfReturn = rateOfReturn - managementFee;
	var annualRateOfReturn = 1.0 + rateOfReturn;
	var annualInflationRate = 1.0 + inflationRate;

	var breakEvenAge = retirementAge;
	var breakEvenAgeSet = false;
	var breakEvenMessage = 'Break-even Age is never reached!';

	var accountValue = getFutureValue(initialDeposit, netRateOfReturn, yearsUntilRetirement);
	var annualWithdrawal = accountValue * initialWithdrawal;
	var accountValueAfterAnnualWithdrawal = accountValue - annualWithdrawal;
	var accountValueAtEndOfYear = accountValueAfterAnnualWithdrawal * annualRateOfReturn;
	var cumulativeInvestmentIncome = annualWithdrawal;
	var presentValueOfInsuranceProductIncome = getPresentValue(insuranceProductIncome, rateOfReturn, yearsCompounded);
	var cumulativePresentValueOfInsuranceProductIncome = presentValueOfInsuranceProductIncome;
	var cumulativeInsuranceProductIncome = insuranceProductIncome;
	var presentValueOfInvestmentIncome = getPresentValue(annualWithdrawal, rateOfReturn, yearsCompounded);
	var cumulativePresentValueOfInvestmentIncome = presentValueOfInvestmentIncome;
	var incomeDifferential = (insuranceProductIncome / annualWithdrawal) * 100;

	if (cumulativeInvestmentIncome > cumulativeInsuranceProductIncome) {
		breakEvenAgeSet = true;
	}

	var age = retirementAge;
	var index = 0;
	var payouts = new Array(numberOfPeriods);

	payouts[index] = {
		age: age
		//,accountValue: accountValue
		//,annualWithdrawal: annualWithdrawal
		//,accountValueAfterAnnualWithdrawal: accountValueAfterAnnualWithdrawal
		//,accountValueAtEndOfYear: accountValueAtEndOfYear
		, cumulativeInvestmentIncome: Math.floor(cumulativeInvestmentIncome)
		//,yearsCompounded: yearsCompounded
		//,insuranceProductIncome: insuranceProductIncome
		//,presentValueOfInsuranceProductIncome: presentValueOfInsuranceProductIncome
		//,cumulativePresentValueOfInsuranceProductIncome: cumulativePresentValueOfInsuranceProductIncome
		, cumulativeInsuranceProductIncome: Math.floor(cumulativeInsuranceProductIncome)
		//,presentValueOfInvestmentIncome: presentValueOfInvestmentIncome
		//,cumulativePresentValueOfInvestmentIncome: cumulativePresentValueOfInvestmentIncome
		//,incomeDifferential: incomeDifferential
	};

	while (++index < numberOfPeriods) {
		age += 1;
		yearsCompounded += 1;

		accountValue = accountValueAtEndOfYear;
		annualWithdrawal *= annualInflationRate;
		accountValueAfterAnnualWithdrawal = accountValue - annualWithdrawal;
		accountValueAtEndOfYear = accountValueAfterAnnualWithdrawal * annualRateOfReturn;
		cumulativeInvestmentIncome += annualWithdrawal;
		presentValueOfInsuranceProductIncome = getPresentValue(insuranceProductIncome, rateOfReturn, yearsCompounded);
		cumulativePresentValueOfInsuranceProductIncome += presentValueOfInsuranceProductIncome;
		cumulativeInsuranceProductIncome += insuranceProductIncome;
		presentValueOfInvestmentIncome = getPresentValue(annualWithdrawal, rateOfReturn, yearsCompounded);
		cumulativePresentValueOfInvestmentIncome += presentValueOfInvestmentIncome;
		incomeDifferential = (insuranceProductIncome / annualWithdrawal) * 100;

		payouts[index] = {
			age: age
			//,accountValue: accountValue
			//,annualWithdrawal: annualWithdrawal
			//,accountValueAfterAnnualWithdrawal: accountValueAfterAnnualWithdrawal
			//,accountValueAtEndOfYear: accountValueAtEndOfYear
			, cumulativeInvestmentIncome: Math.floor(cumulativeInvestmentIncome)
			//,yearsCompounded: yearsCompounded
			//,insuranceProductIncome: insuranceProductIncome
			//,presentValueOfInsuranceProductIncome: presentValueOfInsuranceProductIncome
			//,cumulativePresentValueOfInsuranceProductIncome: cumulativePresentValueOfInsuranceProductIncome
			, cumulativeInsuranceProductIncome: Math.floor(cumulativeInsuranceProductIncome)
			//,presentValueOfInvestmentIncome: presentValueOfInvestmentIncome
			//,cumulativePresentValueOfInvestmentIncome: cumulativePresentValueOfInvestmentIncome
			//,incomeDifferential: incomeDifferential
		};

		if (!breakEvenAgeSet && cumulativeInvestmentIncome > cumulativeInsuranceProductIncome) {
			breakEvenAge = age;
			breakEvenAgeSet = true;
		}
	}

	if (breakEvenAgeSet) {
		breakEvenMessage = 'Break-even age reached when you are ' + breakEvenAge + ' years old';
	}
	var rateOfReturnMessage = 'Based on ' + Math.floor(rateOfReturn * 100) + '% ROR';

	var categories = _.pluck(payouts, 'age');
	var seriesA = _.pluck(payouts, 'cumulativeInvestmentIncome');
	var seriesB = _.pluck(payouts, 'cumulativeInsuranceProductIncome');
	var investmentIncome = payouts[0].cumulativeInvestmentIncome;
	var insuranceProductIncome = payouts[0].cumulativeInsuranceProductIncome;

	var chunks = _.chunkAll(payouts, chunkSize);
	var gogoPayouts = chunks[0];
	var slowgoPayouts = chunks[1];
	var nogoPayouts = chunks[2];

	var cumulativePayoutCategories = ['Go-Go', 'Slow-Go', 'No-Go'];
	var cumulativePayoutSeriesA = [gogoPayouts[0].cumulativeInvestmentIncome, slowgoPayouts[0].cumulativeInvestmentIncome, nogoPayouts[0].cumulativeInvestmentIncome];
	var cumulativePayoutSeriesB = [gogoPayouts[0].cumulativeInsuranceProductIncome, slowgoPayouts[0].cumulativeInsuranceProductIncome, nogoPayouts[0].cumulativeInsuranceProductIncome];

	return {
		investmentIncome: investmentIncome,
		insuranceProductIncome: insuranceProductIncome,
		rateOfReturnMessage: rateOfReturnMessage,
		categories: categories,
		seriesA: seriesA,
		seriesB: seriesB,
		breakEvenMessage: breakEvenMessage,
		cumulativePayoutCategories: cumulativePayoutCategories,
		cumulativePayoutSeriesA: cumulativePayoutSeriesA,
		cumulativePayoutSeriesB: cumulativePayoutSeriesB,
		gogoPayouts: gogoPayouts,
		slowgoPayouts: slowgoPayouts,
		nogoPayouts: nogoPayouts
	};
};
