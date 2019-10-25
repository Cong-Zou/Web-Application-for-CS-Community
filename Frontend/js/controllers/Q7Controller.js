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
			console.log($scope.collaborators);

			// set the dimensions and margins of the graph
			var margin = {top: 10, right: 30, bottom: 30, left: 40},
			  width = 400 - margin.left - margin.right,
			  height = 400 - margin.top - margin.bottom;

			// append the svg object to the body of the page
			var svg = d3.select("#networkGr")
			  .append("svg")
			  .attr("width", width + margin.left + margin.right)
			  .attr("height", height + margin.top + margin.bottom)
			.append("g")
			  .attr("transform",
			        "translate(" + margin.left + "," + margin.top + ")");

			//create appropriate data
			var data = {nodes:[],links:[]};
			var nodecenter = {id: 1, name: name};
			data.nodes.push(nodecenter);
			for (var i=0; i < $scope.collaborators.length; i++){
				var node = {id: i+2, name: $scope.collaborators[i]}
				data.nodes.push(node);
				var link = {source: 1, target: i+2};
				data.links.push(link);
			}
			console.log(data);

			//now draw graph
			// Initialize the links
			  var link = svg.append("g")
      			.attr("class", "links")
			    .selectAll("line")
			    .data(data.links)
			    .enter()
			    .append("line")
			      .style("stroke", "#aaa")


			  // Initialize the nodes
			  var node = svg
			    .selectAll("circle")
			    .data(data.nodes)
			    .enter()
			    .append("circle")
			      .attr("r", 20)
			      .style("fill", "#80aaff")
			 

			      node.append("text")
      				.attr("dx", 12)
      				.attr("dy", ".35em")
      				.text(function(d) { return d.name });

			 // Let's list the force we wanna apply on the network
			  var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
			      .force("link", d3.forceLink()                               // This force provides links between nodes
			            .id(function(d) { return d.id; })                     // This provide  the id of a node
			            .links(data.links)                                    // and this the list of links
			      )
			      .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
			      .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
			      .on("end", ticked);

			  // This function is run at each iteration of the force algorithm, updating the nodes position.
			  function ticked() {
			    link
			        .attr("x1", function(d) { return d.source.x; })
			        .attr("y1", function(d) { return d.source.y; })
			        .attr("x2", function(d) { return d.target.x; })
			        .attr("y2", function(d) { return d.target.y; });

			    node
			         .attr("cx", function (d) { return d.x+6; })
			         .attr("cy", function(d) { return d.y-6; });
			  }


			$scope.changePCView = "showResult";
		});
	}

});