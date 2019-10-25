"use strict";
angular.module("sose-research-community")
.controller("Q1Controller", function($scope, $http, $timeout) {
	
	$scope.changePCView = "";


	// //uncomment the lines below once these routes are implemented

	$scope.getAuthorData = function(){
		var author = document.getElementById("author").value;
		$http.get("https://diwd-team7.herokuapp.com/api/person?name=" + author).then(function(response){
			console.log(response.data);
			$scope.result = response.data;
			console.log($scope.result.photoUrl);
			$scope.changePCView = "showResult";
		});
	}

});