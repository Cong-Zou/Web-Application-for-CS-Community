"use strict";
angular.module("sose-research-community")
.controller("S2Q3Controller", function($scope, $http, $timeout) {
	
	$scope.changePCView = "";


	// //uncomment the lines below once these routes are implemented
	$scope.getResult = function(){
		var keyword1 = document.getElementById("keyword1").value;
		var keyword2 = document.getElementById("keyword2").value;
		$http.get("https://diwd-team7.herokuapp.com/api/search/experts?key=" + keyword1).then(function(response){
			console.log("in S2Q3Controller")
			console.log(response.data);
			var experts1 = response.data;
			var affiliations1Set = new Set();
			var affiliations1arr = new Array();
			for (let i=0; i < experts1.length; i++){
				const affiliation = response.data[i].affiliation;
				if (affiliation.length > 0 && affiliation !== "null") {
					if (!(affiliations1Set.has(affiliation))){
						affiliations1arr.push(affiliation);
						affiliations1Set.add(affiliation);
					}
				}
			}
			//console.log(affiliations1);
			$http.get("https://diwd-team7.herokuapp.com/api/search/experts?key=" + keyword2).then(function(response){
				console.log("experts2")
				console.log(response.data);
				var experts2 = response.data;
				var affiliations2Set = new Set();
				var affiliations2arr = new Array();
				for (let i=0; i < experts2.length; i++){
					const affiliation = response.data[i].affiliation;
					if (affiliation.length > 0 && affiliation !== "null") {
						if (!(affiliations2Set.has(affiliation))){
							affiliations2arr.push(affiliation);
							affiliations2Set.add(affiliation);
						}
					}
				}
				//now we have all affiliations and can begin creating the nodes
				//create appropriate data
				var data = {nodes:[],links:[]};

				var node1 = {id: 1, name: keyword1, group: 1};
				data.nodes.push(node1);
				var node2 = {id: 2, name: keyword2, group: 1};
				data.nodes.push(node2);
				//add affiliations for keyword 1
				var affilMap = new Map();
				var lastid = 0;
				for (let i=0; i < affiliations1arr.length; i++){
					affilMap.set(affiliations1arr[i],i+3)
					var node = {id: i+3, name: affiliations1arr[i], group: 2};
					lastid = i+3;
					data.nodes.push(node);
					var link = {source: 1, target: i+3};
					data.links.push(link);
				}

				//now create nodes for keyword2
				for (let i=0; i < affiliations2arr.length; i++){
					if (affilMap.has(affiliations2arr[i])){
						var id = affilMap.get(affiliations2arr[i]);
						var link = {source: 2, target: id};
						data.links.push(link);
					}
					else {
						var node = {id: lastid + i + 1, name: affiliations2arr[i], group: 2};
						data.nodes.push(node);
						var link = {source: 2, target: lastid + i + 1};
						data.links.push(link);
					}
				}
				console.log("printing data obj")
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

			

		});

		$scope.changePCView = "showResult";
	}

});