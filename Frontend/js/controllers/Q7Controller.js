"use strict";
angular.module("sose-research-community")
.controller("Q7Controller", function($scope, $http, $timeout) {
	
	$scope.changePCView = "";


	// //uncomment the lines below once these routes are implemented
	$scope.changeViewToAllThreads = function(){
		$scope.changePCView = "";
	}

	$scope.changeViewToSendPrivMessage = function(){
		$scope.changePCView = "newPC";
	}

	$scope.showAllQueries = function(){
		$scope.changePCView = "allQueries";
	}

});