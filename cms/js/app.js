(function() {
	var app = angular.module('app', ['app.controllers','app.filters','app.services']);

	//Routing by ui.router
	app.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
		.state('page1', {
			url: '/',
			controller: 'DashboardController',
			templateUrl: 'partials/dashboard.html'
		})
		.state('page2', {
			url: '/post',
			controller: 'TableController',
			templateUrl: 'partials/posts.html'
		})
		.state('page3', {
			url: '/comments',
			controller: 'CommentsTableController',
			templateUrl: 'partials/comments.html'
		})
		.state('page4', {
			url: '/users',
			controller: 'UsersTableController',
			templateUrl: 'partials/users.html'
		})
		.state('page5', {
			url: '/edit',
			controller: 'EditPageController',
			templateUrl: 'partials/editPost.html'
		})
		.state('page6', {
			url: '/profile',
			controller: 'profilePageController',
			templateUrl: 'partials/profile.html'
		})
		.state('page7', {
			url: '/tags',
			controller: 'tagsPageController',
			templateUrl: 'partials/tags.html'
		})
		.state('page8', {
			url: '/contacts',
			controller: 'contactsPageController',
			templateUrl: 'partials/contacts.html'
		});
	});
}());
