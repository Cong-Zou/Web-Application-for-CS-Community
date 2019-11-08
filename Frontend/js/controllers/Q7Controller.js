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
			for (let i=0; i < response.data.length; i++){
				const authorName = response.data[i].name;
				if (authorName.length > 0 && authorName !== "null") {
					$scope.collaborators.push(response.data[i].name);
				}
			}
			console.log($scope.collaborators);

			//create appropriate data
			var data = {nodes:[],links:[]};
			var nodecenter = {id: 1, name: name, group: 1};
			data.nodes.push(nodecenter);
			for (let i=0; i < $scope.collaborators.length; i++){
				var node = {id: i+2, name: $scope.collaborators[i], group: 2};
				data.nodes.push(node);
				var link = {source: 1, target: i+2};
				data.links.push(link);
			}
			console.log(data);

			var svg = d3.select("svg"),
				width = +svg.attr("width"),
				height = +svg.attr("height");

			// clear graph before reloading
			svg.selectAll("*").remove();

			var color = d3.scaleOrdinal(d3.schemeCategory20);

			// initialize links
			var link = svg.append("g")
				.attr("class", "links")
				.selectAll("line")
				.data(data.links)
				.enter().append("line");

			// initialize nodes
			var node = svg.append("g")
				.attr("class", "nodes")
				.selectAll("g")
				.data(data.nodes)
				.enter().append("g");

			node.append("circle")
				.attr("r", 20)
				.attr("fill", function (d) {
					return color(d.group);
				})
				.attr("data-toggle", "modal")
				.attr("data-target", "#exampleModal")
				.call(d3.drag()
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended));

			node.append("text")
				.text(function (d) {
					return d.name;
				})
				.attr('x', 18)
				.attr('y', 3);

			var simulation = d3.forceSimulation()
				.force("link", d3.forceLink().id(function (d) {
					return d.id;
				}).distance(function (d) {
					return 100;
				}))
				.force("charge", d3.forceManyBody())
				.force("center", d3.forceCenter(width / 2, height / 2));

			simulation
				.nodes(data.nodes)
				.on("tick", ticked);

			simulation.force("link")
				.links(data.links);

			function ticked() {
				link
					.attr("x1", function (d) {
						return d.source.x;
					})
					.attr("y1", function (d) {
						return d.source.y;
					})
					.attr("x2", function (d) {
						return d.target.x;
					})
					.attr("y2", function (d) {
						return d.target.y;
					});

				node
					.attr("transform", function (d) {
						return "translate(" + d.x + "," + d.y + ")";
					})
			}


			function dragstarted(d) {
				if (!d3.event.active) simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			}

			function dragged(d) {
				d.fx = d3.event.x;
				d.fy = d3.event.y;
			}

			function dragended(d) {
				if (!d3.event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			}

		});

		$scope.changePCView = "showResult";
	}

});