"use strict";
angular.module("sose-research-community")
.controller("Q5Controller", function($scope, $http, $timeout) {
	
	$scope.changePCView = "";


	// //uncomment the lines below once these routes are implemented
	$scope.getResult = function(){
		var channel = document.getElementById("channel").value;
		var year = document.getElementById("year").value;
		$http.get("https://diwd-team7.herokuapp.com/api/search/focused_topics?channelName=" + channel + "&year=" + year).then(function(response){
			console.log(response.data);
			$scope.topicArr = new Array();
			for (var i=0; i < response.data.length; i++){
				if (response.data[i][0] != "null"){
					$scope.topicArr.push(response.data[i][0]);
				}
			}
			
			$scope.changePCView = "showResult";
		});
	}

});