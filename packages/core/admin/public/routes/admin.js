'use strict';

function AdminRoutes($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('admin', {
			url: '/admin',
			templateUrl: 'admin/views/admin.html',
			abstract: true
		})
		.state('admin.index', {
			url: '/index',
			templateUrl: 'admin/views/index.html',
			resolve: {
				isAdmin: function (AuthFactory) {
					return AuthFactory.isAdmin();
				}
			}
		})
		.state('admin.users', {
			url: '/users',
			templateUrl: 'admin/views/users.html',
			resolve: {
				isAdmin: function (AuthFactory) {
					return AuthFactory.isAdmin();
				}
			}
		})
		.state('admin.settings', {
			url: '/settings',
			templateUrl: 'admin/views/settings.html',
			resolve: {
				isAdmin: function (AuthFactory) {
					return AuthFactory.isAdmin();
				}
			}
		})
		.state('modules', {
			url: '/modules',
			templateUrl: 'admin/views/modules.html',
			resolve: {
				isAdmin: function (AuthFactory) {
					return AuthFactory.isAdmin();
				}
			}
		});

}

function setZeroClipboardPath(ngClipProvider) {
	ngClipProvider.setPath('../admin/assets/lib/zeroclipboard/dist/ZeroClipboard.swf');
}

var app = angular.module('mean.admin');
app.config(AdminRoutes);
app.config(setZeroClipboardPath);
