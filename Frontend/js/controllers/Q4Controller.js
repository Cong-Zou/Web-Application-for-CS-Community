"use strict";
angular.module("sose-research-community")
.controller("Q4Controller", function($scope, $http, $timeout) {
	
	$scope.changePCView = "";


	// //uncomment the lines below once these routes are implemented
	$scope.getResult = function(){
		var keywords = document.getElementById("keywords").value;
		$http.get("https://diwd-team7.herokuapp.com/api/search/experts?key=" + keywords).then(function(response){
			console.log(response.data);
			$scope.experts = response.data;
			
			$scope.changePCView = "showResult";
		});
	}

});