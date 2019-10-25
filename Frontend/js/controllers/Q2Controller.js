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

			//create an array with the above data
			var arr = new Array();
			var keys = map.keys();
			for (var key of keys){
				var val = map.get(key);
				var entry = {year: key, numPubs: val};
				arr.push(entry);
			}
			console.log(arr);

			//now build histogram where map keys are x axis and corresponding values are height of each bar
			const margin = 60;
		    const width = 1000 - 2 * margin;
		    const height = 600 - 2 * margin;

		    const svg = d3.select('svg');

		    const chart = svg.append('g')
   				.attr('transform', `translate(${margin}, ${margin})`);
   			const yScale = d3.scaleLinear()
    			.range([height, 0])
    			.domain([0, 100]);
    		chart.append('g')
    			.call(d3.axisLeft(yScale));

			const xScale = d3.scaleBand()
    			.range([0, width])
    			.domain(arr.map((s) => s.year))
    			.padding(0.2)

			chart.append('g')
    			.attr('transform', `translate(0, ${height})`)
    			.call(d3.axisBottom(xScale));

    		chart.selectAll()
    			.data(arr)
    			.enter()
    			.append('rect')
    			.attr('x', (s) => xScale(s.year))
    			.attr('y', (s) => yScale(s.numPubs))
    			.attr('height', (s) => height - yScale(s.value))
    			.attr('width', xScale.bandwidth())
				.attr('x', (actual, index, array) => 
    			xScale(actual.value))


  
			
			$scope.changePCView = "showResult";
		});
	}

});