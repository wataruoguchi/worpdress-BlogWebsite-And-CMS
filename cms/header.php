<?php
include("./auth.php");
?>
<!doctype html>
<html class="no-js" lang="en" ng-app="app">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>AngularJS <3 Foundation | Welcome</title>
	<link rel="icon" type="image/png" href="./asset/favicon.ico">
<!-- 
	<link rel="stylesheet" href="http://cdn.foundation5.zurb.com/foundation.css" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/ng-tags-input/2.1.1-1/ng-tags-input.min.css">
 -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
	<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
	<link rel="stylesheet" href="./lib/vendor/foundation.min.css" />
	<link rel="stylesheet" href="./lib/vendor/ng-tags-input.min.css" />
	<link rel="stylesheet" href="./lib/vendor/cropme.css" />
	<link rel="stylesheet" href="./css/style.css" />
	
	<!--
	<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-resource.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.11/angular-ui-router.min.js"></script>
	<script src='//cdnjs.cloudflare.com/ajax/libs/textAngular/1.2.2/textAngular-sanitize.min.js'></script>
	<script src='//cdnjs.cloudflare.com/ajax/libs/textAngular/1.2.2/textAngular.min.js'></script>
	<script src='//cdnjs.cloudflare.com/ajax/libs/ng-tags-input/2.1.1-1/ng-tags-input.min.js'></script>
	-->
	<script src='./lib/angular/min/angular.min.js'></script>
	<script src='./lib/angular/min/resource.min.js'></script>
	<!-- dependencies for cropme start -->
	<script src='./lib/angular/min/sanitize.min.js'></script>
	<script src='./lib/angular/min/touch.min.js'></script>
	<script src='./lib/vendor/min/superswipe.min.js'></script>
	<script src='./lib/vendor/min/cropme.min.js'></script>
	<!-- dependencies for cropme end -->
	<script src='./lib/vendor/min/ui-bootstrap-tpls-0.11.2.min.js'></script>
	<script src='./lib/vendor/min/angular-ui-router.min.js'></script>
	<script src='./lib/vendor/min/textAngular-sanitize.min.js'></script>
	<script src='./lib/vendor/min/textAngular.min.js'></script>
	<script src='./lib/vendor/min/ng-tags-input.min.js'></script>
	<script src="./js/app.js"></script>
	<script src="./js/filters.js"></script>
	<script src="./js/services.js"></script>
	<script src="./js/controllers.js"></script>
	<script src="./js/directives.js"></script>
	<script src='./lib/vendor/min/modernizr.min.js'></script>
</head>
<body ng-controller="MainController">