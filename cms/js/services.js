(function(){
	var app = angular.module('app.services', []);

	app.value('sharedObject', function(){
		var sharedContainer = {
			postId: null,
			userId: null,
			roleId: null,
			editUserId: null
		};
		return sharedContainer;
	});
}());
