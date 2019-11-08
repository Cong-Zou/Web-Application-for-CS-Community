"use strict";
angular.module("sose-research-community")
.controller("S2Q1Controller", function($scope, $http, $timeout) {
	
	$scope.changePCView = "";


	$scope.helper = function(index, urlstr){
		$http.get(urlstr).then(function(response){
				console.log(response.data);
				$scope.result = response.data;
				console.log(index)
				document.getElementById("topicHistograms").innerHTML += "<h3>"+ index + " Topics" +"</h3>"
				//var data = new Array();
				var data = {}
				for (var j=0; j<$scope.result.length; j++){
					//var entry = {$scope.result[j][0]: $scope.result[j][0]};
					var word = $scope.result[j][0]
					data[word] = $scope.result[j][1]
				}
				console.log(data)
			

				// set the dimensions and margins of the graph
				var width = 450
				var height = 450
				var margin = 40

				// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
				var radius = Math.min(width, height) / 2 - margin

				// append the svg object to the div called 'my_dataviz'
				var svg = d3.select("#topicHistograms")
				  .append("svg")
				    .attr("width", width)
				    .attr("height", height)
				  .append("g")
				    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

				// Create dummy data
				//var data = {a: 9, b: 20, c:30, d:8, e:12}

				// set the color scale
				var color = d3.scaleOrdinal()
				  .domain(data)
				  .range(d3.schemeSet2);

				// Compute the position of each group on the pie:
				var pie = d3.pie()
				  .value(function(d) {return d.value; })
				var data_ready = pie(d3.entries(data))
				// Now I know that group A goes from 0 degrees to x degrees and so on.

				// shape helper to build arcs:
				var arcGenerator = d3.arc()
				  .innerRadius(0)
				  .outerRadius(radius)

				// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
				svg
				  .selectAll('mySlices')
				  .data(data_ready)
				  .enter()
				  .append('path')
				    .attr('d', arcGenerator)
				    .attr('fill', function(d){ return(color(d.data.key)) })
				    .attr("stroke", "black")
				    .style("stroke-width", "2px")
				    .style("opacity", 0.7)

				// Now add the annotation. Use the centroid method to get the best coordinates
				svg
				  .selectAll('mySlices')
				  .data(data_ready)
				  .enter()
				  .append('text')
				  .text(function(d){ return d.data.key})
				  .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
				  .style("text-anchor", "middle")
				  .style("font-size", 10)

				// // again rebind for legend
				// var legendG = svg.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
				//   .data(pie(data))
				//   .enter().append("g")
				//   .attr("transform", function(d,i){
				//     return "translate(" + (width - 110) + "," + (i * 15 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
				//   })
				//   .attr("class", "legend");   

				// legendG.append("rect") // make a matching color rect
				//   .attr("width", 10)
				//   .attr("height", 10)
				//   .attr("fill", function(d, i) {
				//     return(color(d.data.key))
				//   });

				// legendG.append("text") // add the text
				//   .text(function(d){
				//     return d.data.key + "  " + d.data.value;
				//   })
				//   .style("font-size", 12)
				//   .attr("y", 10)
				//   .attr("x", 11);
			});
	}

	$scope.getTopicData = function(){
		var year1 = document.getElementById("year1").value;
		var year2 = document.getElementById("year2").value;
		var journal = document.getElementById("journal").value;
		console.log(year1)
		console.log(year2)
		for (var i=year1; i <= year2; i++){
			console.log("in loop")
			var urlstr = "https://diwd-team7.herokuapp.com/api/search/focused_topics?channelName="+ journal + '&year='+ i
			console.log(urlstr)
			$scope.helper(i,urlstr)
			
		}
	}

});