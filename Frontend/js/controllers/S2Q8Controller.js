"use strict";
angular.module("sose-research-community")
  .controller("S2Q7Controller", function($scope, $http, $timeout) {
    $scope.changePCView = "";

    $scope.getResult = function(){
      const researcher = document.getElementById("researcher").value;
      //todo:

      $http.get("http://localhost:3000/api/collaboration?name=" + researcher).then(function(response){
        console.log(response.data);
        const graph = response.data;

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
          .data(graph.links)
          .enter().append("line");

        // initialize nodes
        var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("g")
          .data(graph.nodes)
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
          .nodes(graph.nodes)
          .on("tick", ticked);

        simulation.force("link")
          .links(graph.links);

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