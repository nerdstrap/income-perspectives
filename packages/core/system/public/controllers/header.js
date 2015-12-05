'use strict';

function HeaderController($scope, $rootScope, $state, Menus, AuthFactory, AuthEvents) {
	var vm = this;

	vm.master = {};

	vm.menus = {};

	vm.status = {
		collapsed: false,
		loginVisible: true,
		logoutVisible: false
	};

	vm.view = {
		title: 'Page Title',
		rootUrl: '/',
		rootTitle: 'Home'
	};

	var defaultMainMenu = [];

	function getMenu(name, defaultMenu) {
		Menus.query({
			name: name,
			defaultMenu: defaultMenu
		}, function (menu) {
			vm.menus[name] = menu;
		});
	}

	function logout() {
		AuthFactory.logout();
	}

	$rootScope.$on(AuthEvents.loggedIn, function (event, user) {
		getMenu('main', defaultMainMenu);
		vm.status.loginVisible = false;
		vm.status.logoutVisible = true;
		vm.user = user;
	});

	$rootScope.$on(AuthEvents.loggedOut, function () {
		vm.status.loginVisible = true;
		vm.status.logoutVisible = false;
		vm.user = angular.copy(vm.master);
		getMenu('main', defaultMainMenu);
	});

	function init() {
		vm.user = angular.copy(vm.master);
		getMenu('main', defaultMainMenu);
	}

	function reset() {
		vm.init();
	}

	vm.logout = logout;
	vm.init = init;
	vm.reset = reset;

	vm.init();
}

var app = angular.module('mean.system');
app.controller('HeaderController', HeaderController);
