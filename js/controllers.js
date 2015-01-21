(function() {
	var app = angular.module('app.controllers', ['ui.router','ui.bootstrap','ngResource','ngScrollTo','infinite-scroll']);

	/*= = = = = = = = MAIN - START = = = = = = = = */
	app.controller('MainController', function($scope, $location){
		// Initalize
		$scope.pageActive = ($location.path()==='/about')? "about" : "home";

		$scope.setActive = function(type) {
			$scope.pageActive = type;
		};
		$scope.isActive = function (type) {
			return type === $scope.pageActive;
		};
	});
	/*= = = = = = = = MAIN - END = = = = = = = = */

	/*= = = = = = = = HOME PAGE - START = = = = = = = = */
	app.controller('HomeController', function($scope, $resource, $filter){
		$scope.articles = [];
		$scope.filteredResults = [];
		$scope.predicate = 'updatedDate';
		$scope.orderActive = 'newest';

		$scope.setOrder = function(type) {
			$scope.orderActive = type;
		};
		$scope.isOrder = function (type) {
			return type === $scope.orderActive;
		};

		$scope.getSearchResult = function() {
			$scope.filteredResults = $filter('filter')($scope.articles, $scope.searchBox);
		};

		$scope.$watch('searchBox', function(newSearchBox) {
			$scope.getSearchResult();
		});

		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResArticlesList = $resource('./dataRes/dataResArticlesList.php', {}, {});

		//SELECT
		$scope.articles = $scope.dataResArticlesList.query(function(){
			//get tags
			angular.forEach($scope.articles, function(record, index){
				var $dataResEditViewTags = $resource('./cms/dataRes/dataResEditViewTags.php', {postId:record.postId});
				record.tags = $dataResEditViewTags.query();
			});
		});
		//DATABASE INTERFACE END--------------------
	});
	/*= = = = = = = = HOME PAGE - END = = = = = = = = */


	/*= = = = = = = = ARTICLE PAGE - START = = = = = = = = */
	app.controller('ArticleController', function($scope, $resource, $stateParams, $sce, $state){
		//get id
		$scope.postId = $stateParams.postId;
		$scope.article = [];

		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResArticle = $resource('./dataRes/dataResArticle.php', {
			postId: $scope.postId
		}, {
			update: {method: 'PUT'}
		});

		$scope.commentarticle = [];
		$scope.article = [];
		$scope.comments = [];

		//SELECT
		articleAndComments = $scope.dataResArticle.query(function(){
			if(articleAndComments.length == 0 || articleAndComments[0].replyId != null) {
				//This access is not allowed
				$state.go('home');
			}
			angular.forEach(articleAndComments, function(record, index){
				if(index == 0 && record.replyId == null) {
					record.$update();
					$scope.article.push(record);
					$body = $sce.trustAsHtml($scope.article[index].body);
					$scope.article[index].body = $body;

					//get tags
					var $dataResEditViewTags = $resource('./cms/dataRes/dataResEditViewTags.php', {postId:record.postId});
					$scope.article[index].tags = $dataResEditViewTags.query();
				}
				else {
					$scope.comments.push(record);
				}
			});
		});
		//DATABASE INTERFACE END--------------------

		$scope.toggle = false;
		$scope.commentToggle = function() {
			$scope.toggle = !$scope.toggle;
		};

		$scope.replyNo = 0;
		$scope.replyClick = function(param) {
			$scope.replyNo = ($scope.replyNo == param)?0:param;
		};

		submit = function() {
			var json = [];
			json.push({
				replyId:$scope.commentarticle.replyId,
				name:$scope.commentarticle.name,
				email:$scope.commentarticle.email,
				url:$scope.commentarticle.url,
				message:$scope.commentarticle.message
			});
			$scope.dataResArticle.save(json);

			// http://stackoverflow.com/questions/21714655/angular-js-angular-ui-router-reloading-current-state-refresh-data
			//page reload
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		};

		$scope.submitReply = function(param) {
			console.log('reply='+param);
			$scope.commentarticle.replyId = param;
			submit();
		};
		$scope.submitComment = function() {
			$scope.commentarticle.replyId = $scope.postId;
			submit();
		};
	});
	/*= = = = = = = = ARTICLE PAGE - END = = = = = = = = */


	/*= = = = = = = = ABOUT PAGE - START = = = = = = = = */
	app.controller('ContactController', function($scope, $resource, $stateParams, $state){
		$scope.contact = [];
		$scope.submitContact = function() {
			var json = [];
			json.push({
				name:$scope.contact.name,
				email:$scope.contact.email,
				message:$scope.contact.message});
			Res.save(json);
			
			//page reload
			$state.transitionTo($state.current, $stateParams, {
				reload: true,
				inherit: false,
				notify: true
			});
		};

		//DATABASE INTERFACE START--------------------
		var Res = $resource('./dataRes/dataResContact.php');
		//DATABASE INTERFACE END--------------------
	});
	/*= = = = = = = = ABOUT PAGE - END = = = = = = = = */
}());
