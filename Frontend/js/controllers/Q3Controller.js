"use strict";
angular.module("sose-research-community")
.controller("Q3Controller", function($scope, $http, $timeout, $compile) {
	
	$scope.changePCView = "";


	// //uncomment the lines below once these routes are implemented
	$scope.getResult = function(){
		console.log(document.getElementById("journal").innerHTML);
		console.log("gettting result");
		
		// $scope.chart_data = "40, 80, 15, 60, 23, 95";
		// var index = 0;
		// var data = angular.fromJson("[" + $scope.chart_data + "]");
		// var bar_width = 500 / (data.length); 
		// /* Clear out the existing elements. */
		// d3.selectAll('.chart').selectAll('div').remove();
		// d3.select(".chart")
  //       .selectAll("div")
  //       .data(data)
  //       .enter().append("div")
  //       .style("width", function(d) { return bar_width + "px"; })
  //       .style("height", function(d) { return d + "%"; })
  //       /* +2 as we have a 1px margin */
  //       .style("left", function(d) { return (index++) * (bar_width + 2) + "px"; }); 

		// var data = [
		// 		{volume:1,numAuths:100},
		// 		{volume:2,numAuths:200}
		// 	]

			

			//$scope.changePCView = "showResult";
		var journal = document.getElementById("journal").value;
		$http.get("https://diwd-team7.herokuapp.com/api/channel?name=" + journal).then(function(response){
			console.log(response.data);
			var map = new Map();
			$scope.volumes = response.data.volumes;
			for (var i=0; i < $scope.volumes.length; i++){
					console.log($scope.volumes[i].name)
					console.log($scope.volumes[i].authorCount.low)
					map.set($scope.volumes[i].name,$scope.volumes[i].authorCount.low);
			}
			//now build histogram where map keys are x axis and the value is the height of bars
			//create an array with the above data

			var data = new Array();
			var keys = map.keys();
			for (var key of keys){
				var val = map.get(key);
				console.log(val);
				var entry = {volume: key, numAuths: val};
				console.log(key);
				data.push(entry);
			}
			console.log(data);


			//now build histogram where map keys are x axis and corresponding values are height of each bar
			var padding = {top:20,bottom:30,left:50,right:30};
			var colors = d3.schemeCategory20c;
			const svg = d3.select('#svg');
			console.log(svg);
			var chartArea = {
				width: parseInt(svg.style("width"))-padding.left-padding.right,
				height: parseInt(svg.style("height"))-padding.top-padding.bottom
			}
			// var chartArea = {
			// 	width: 520,
			// 	height: 250
			// }

			var yScale = d3.scaleLinear()
				.domain([0,d3.max(data,function(d,i) {return d.numAuths})])
				.range([chartArea.height,0]).nice();
				//.range([0,chartArea.height]).nice();

			var xScale = d3.scaleBand()
				.domain(data.map(function(d) {return d.volume}))
				.range([0,chartArea.width])
				.padding(.2);

			var xAxis = svg.append("g")
				.classed("xAxis",true)
				.attr('transform', 'translate(' + padding.left + ',' + (chartArea.height + padding.top) + ')')
				.call(d3.axisBottom(xScale));

			// text label for the x axis
  			svg.append("text")             
      			.attr("transform","translate(" + (chartArea.width/2) + " ," + (chartArea.height + 50) + ")")
      			.style("text-anchor", "middle")
      			.text("volume");

				console.log(svg);

			var yAxisFn = d3.axisLeft(yScale);
			var yAxis = svg.append("g")
				.classed("yAxis",true)
				.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
			yAxisFn(yAxis);

			// text label for the y axis
			  svg.append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 0-5)
			      .attr("x",(0 - chartArea.height/2))
			      .attr("dy", "1em")
			      .style("text-anchor", "middle")
			      .text("Author Count");   

			var rectGrp = svg.append("g")
				.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

			rectGrp.selectAll("rect").data(data).enter()
				.append("rect")
				.attr("width",xScale.bandwidth())
				.attr("height", function(d,i){
					return chartArea.height - yScale(d.numAuths);
					//return yScale(d.numAuths);
				})
				.attr("x",function(d,i){
					return xScale(d.volume);
				})
				.attr("y",function(d,i){
					return yScale(d.numAuths);
				})
				// .attr("fill",function(d,i){
				// 	return colors[i];
				// })
			





		
		});
	}

});