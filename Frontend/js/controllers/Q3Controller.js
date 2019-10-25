"use strict";
angular.module("sose-research-community")
.controller("Q3Controller", function($scope, $http, $timeout) {
	
	$scope.changePCView = "";


	// //uncomment the lines below once these routes are implemented
	$scope.getResult = function(){
		var journal = document.getElementById("journal").value;
		$http.get("https://diwd-team7.herokuapp.com/api/channel?name=" + journal).then(function(response){
			console.log(response.data);
			var map = new map();
			$scope.volumes = response.data;
			for (var i=0; i < $scope.volumes.length; i++){
					map.set($scope.volumes[i].name,$scope.volumes[i].authorCount.low);
			}
			//now build histogram where map keys are x axis and the value is the height of bars
			$scope.changePCView = "result";
		});
	}

});