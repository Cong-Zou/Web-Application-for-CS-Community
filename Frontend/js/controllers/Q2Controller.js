"use strict";
angular.module("sose-research-community")
.controller("Q2Controller", function($scope, $http, $timeout) {
	
	$scope.changePCView = "";


	// //uncomment the lines below once these routes are implemented

	$scope.getResult = function(){
		var author = document.getElementById("author").value;
		var start = document.getElementById("startYear").value;
		var end = document.getElementById("endYear").value;
		$http.get("https://diwd-team7.herokuapp.com/api/person/publications?name=" + author + "&startYear=" + start + "&endYear=" + end).then(function(response){
			console.log(response.data);
			var map = new Map();
			$scope.result = response.data;
			for (var i=0; i < $scope.result.length; i++){
				if (map.has($scope.result[i].year)){
					map.get($scope.result[i].year) = map.get($scope.result[i].year) + 1;
				}
				else {
					map.set($scope.result[i].year,1);
				}
			}

			var arr = new Array();
			var keys = map.keys();
			for (var key of keys){
				var val = map.get(key);
				var entry = {year: key, numPubs: val};
				arr.push(entry);
			}
			console.log(arr);


  
			
			$scope.changePCView = "showResult";
		});
	}

});