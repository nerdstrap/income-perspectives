'use strict';

function UsersController($scope, $rootScope, Global, Circles, UsersFactory, $uibModal) {
	$scope.global = Global;

	var vm = this;

	vm.status = {
		addUserVisible: false
	};

	Circles.mine(function (acl) {

		var circles = acl.allowed;

		vm.userSchema = [
			{
				title: 'Email',
				schemaKey: 'email',
				type: 'email',
				inTable: true
			},
			{
				title: 'Name',
				schemaKey: 'name',
				type: 'text',
				inTable: true
			},
			{
				title: 'Username',
				schemaKey: 'username',
				type: 'text',
				inTable: true
			},
			{
				title: 'Roles',
				schemaKey: 'roles',
				type: 'select',
				options: circles,
				inTable: true
			},
			{
				title: 'Password',
				schemaKey: 'password',
				type: 'password',
				inTable: false
			},
			{
				title: 'Repeat password',
				schemaKey: 'confirmPassword',
				type: 'password',
				inTable: false
			}
		];

	});

	vm.master = {};

	vm.status = {};

	function getUsers() {
		UsersFactory.query({}, function (users) {
			vm.users = angular.copy(users);
		});
	}

	function showAddUser() {
		var modalInstance = $uibModal.open({
			templateUrl: 'addUserModalContent.html',
			controller: 'AddUserModalCtrl',
			resolve: {
				newUser: function () {
					return vm.newUser;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			//$scope.selected = selectedItem;
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	}

	function cancelAddUser() {
		vm.newUser = angular.copy(vm.master);
		vm.status.addUserVisible = false;
	}

	function addUser(user) {
		var newUser = new UsersFactory({
			email: user.email,
			name: user.name,
			username: user.username,
			password: user.password,
			confirmPassword: user.confirmPassword,
			roles: user.roles
		});

		newUser.$save(
			function (response) {
				vm.newUser = angular.copy(vm.master);
				vm.users.push(newUser);
			},
			function (error) {
			}
		);
	}


	function init() {
		vm.users = [];
	}

	function reset() {
		vm.init();
	}

	vm.getUsers = getUsers;
	vm.showAddUser = showAddUser;
	vm.cancelAddUser = cancelAddUser;
	vm.addUser = addUser;
	vm.init = init;
	vm.reset = reset;

	vm.init();
	vm.getUsers();
}

function AddUserModalCtrl($scope, $uibModalInstance, newUser) {

	$scope.newUser = newUser;

	$scope.ok = function () {
		$uibModalInstance.close($scope.newUser);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}

var app = angular.module('mean.admin');
app.controller('UsersController', UsersController);
app.controller('AddUserModalCtrl', AddUserModalCtrl);
