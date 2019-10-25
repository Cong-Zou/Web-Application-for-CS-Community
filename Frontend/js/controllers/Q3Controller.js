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
			//create an array with the above data
			var arr = new Array();
			var keys = map.keys();
			for (var key of keys){
				var val = map.get(key);
				var entry = {volume: key, numAuths: val};
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
    			.domain(arr.map((s) => s.volume))
    			.padding(0.2)

			chart.append('g')
    			.attr('transform', `translate(0, ${height})`)
    			.call(d3.axisBottom(xScale));

    		chart.selectAll()
    			.data(arr)
    			.enter()
    			.append('rect')
    			.attr('x', (s) => xScale(s.volume))
    			.attr('y', (s) => yScale(s.numAuths))
    			.attr('height', (s) => height - yScale(s.value))
    			.attr('width', xScale.bandwidth())
				.attr('x', (actual, index, array) => 
    			xScale(actual.value))

			$scope.changePCView = "showResult";
		});
	}

});