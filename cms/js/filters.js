(function(){
	var app = angular.module('app.filters', []);

	//angulartutorial.blogspot.ca/2014/03/client-side-pagination-using-angular-js.html
	app.filter('startFrom', function() {
		return function(inputArr, start) {
			start =+ start;
			if(!inputArr || !inputArr.length) {
				return;
			}
			return inputArr.slice(start);
		};
	});
}());
