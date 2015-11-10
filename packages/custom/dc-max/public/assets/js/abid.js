'use strict';

var Abid = function () {
	return {
		getBreakEvenAnalysis: function (currentAge, retirementAge, numberOfPeriods, initialDeposit, rateOfReturn, managementFee, insuranceProductIncome, initialWithdrawal, inflationRate) {
			var yearsUntilRetirement = retirementAge - currentAge;
			var yearsCompounded = yearsUntilRetirement;
			var chunkSize = Math.floor(numberOfPeriods / 3);
			var netRateOfReturn = rateOfReturn - managementFee;
			var annualRateOfReturn = 1.0 + rateOfReturn;
			var annualInflationRate = 1.0 + inflationRate;

			var breakEvenAge = retirementAge;
			var breakEvenAgeSet = false;

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
				, cumulativeInvestmentIncome: cumulativeInvestmentIncome
				//,yearsCompounded: yearsCompounded
				//,insuranceProductIncome: insuranceProductIncome
				//,presentValueOfInsuranceProductIncome: presentValueOfInsuranceProductIncome
				//,cumulativePresentValueOfInsuranceProductIncome: cumulativePresentValueOfInsuranceProductIncome
				, cumulativeInsuranceProductIncome: cumulativeInsuranceProductIncome
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
					, cumulativeInvestmentIncome: cumulativeInvestmentIncome
					//,yearsCompounded: yearsCompounded
					//,insuranceProductIncome: insuranceProductIncome
					//,presentValueOfInsuranceProductIncome: presentValueOfInsuranceProductIncome
					//,cumulativePresentValueOfInsuranceProductIncome: cumulativePresentValueOfInsuranceProductIncome
					, cumulativeInsuranceProductIncome: cumulativeInsuranceProductIncome
					//,presentValueOfInvestmentIncome: presentValueOfInvestmentIncome
					//,cumulativePresentValueOfInvestmentIncome: cumulativePresentValueOfInvestmentIncome
					//,incomeDifferential: incomeDifferential
				};

				if (!breakEvenAgeSet && cumulativeInvestmentIncome > cumulativeInsuranceProductIncome) {
					breakEvenAge = age;
					breakEvenAgeSet = true;
				}
			}

			if (!breakEvenAgeSet) {
				breakEvenAge = 1000;
			}

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
				rateOfReturn: rateOfReturn,
				categories: categories,
				seriesA: seriesA,
				seriesB: seriesB,
				breakEvenAge: breakEvenAge,
				cumulativePayoutCategories: cumulativePayoutCategories,
				cumulativePayoutSeriesA: cumulativePayoutSeriesA,
				cumulativePayoutSeriesB: cumulativePayoutSeriesB,
				gogoPayouts: gogoPayouts,
				slowgoPayouts: slowgoPayouts,
				nogoPayouts: nogoPayouts
			};
		}
	};
}();
