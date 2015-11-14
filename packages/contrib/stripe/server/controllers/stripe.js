'use strict';

module.exports = function (Stripe) {
	return {
		packageName: function (req, res, next) {
			return 'stripe';
		}
	};
};
