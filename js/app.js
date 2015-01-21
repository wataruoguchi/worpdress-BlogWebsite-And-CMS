(function() {
	var app = angular.module('app', ['app.controllers']);

	//Routing by ui.router
	app.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('home', {
			url: '/',
			controller: 'HomeController',
			templateUrl: './partials/home.html'
		})
		.state('article', {
			// http://stackoverflow.com/questions/21097820/angular-ui-router-how-to-access-parameters-in-nested-named-view-passed-from
			url: '/article/:postId',
			controller: 'ArticleController',
			templateUrl: './partials/article.html'
		})
		.state('about', {
			url: '/about',
			templateUrl: './partials/about.html'
		});
		$urlRouterProvider.otherwise('/');
	});
}());
