"use strict";
angular.module("sose-research-community")
.controller("Q7Controller", function($scope, $http, $timeout) {
	
	$scope.changePCView = "";


	// //uncomment the lines below once these routes are implemented
	$scope.getResult = function(){
		var name = document.getElementById("researcher").value;
		$http.get(" https://diwd-team7.herokuapp.com/api/person/coworkers?name=" + name).then(function(response){
			console.log("in")
			console.log(response.data);
			$scope.collaborators = new Array();
			for (var i=0; i < response.data.length; i++){
				$scope.collaborators.push(response.data[i].name);
			}
			console.log($scope.collaborators)
			$scope.changePCView = "showResult";
		});
	}

});