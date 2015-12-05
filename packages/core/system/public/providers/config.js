'use strict';

function $meanConfig() {
	function MeanConfigProvider() {
		this.config = {};

		var self = this;

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				self.config = JSON.parse(xmlhttp.responseText);
			}
		};

		xmlhttp.open("GET", "/api/get-public-config", false);
		xmlhttp.send();

		this.$get = function () {
			return this.config;
		};
	}

	return new MeanConfigProvider();
}

var app = angular.module('mean.system');
app.provider('$meanConfig', $meanConfig);
