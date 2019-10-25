"use strict";
angular.module("sose-research-community")
.controller("Q6Controller", function($scope, $http, $timeout) {
	
	$scope.changePCView = "";


	// //uncomment the lines below once these routes are implemented
	$scope.getResult = function(){
		var paper = document.getElementById("paper").value;
		$http.get(" https://diwd-team7.herokuapp.com/api/paper?title=" + paper).then(function(response){
			console.log(response.data);
			$scope.result = response.data;
			$scope.changePCView = "showResult";
		});
	}

});