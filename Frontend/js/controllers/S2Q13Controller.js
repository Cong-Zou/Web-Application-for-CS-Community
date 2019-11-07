"use strict";
angular.module("sose-research-community")
  .controller("S2Q13Controller", function($scope, $http, $timeout) {
    $scope.changePCView = "";

    $scope.getResult = function(){
      const channel = document.getElementById("channel").value;
      const start = document.getElementById("startYear").value;
      const end = document.getElementById("endYear").value;

      console.log("channel: " + channel + " start: " + start + " end: " + end);

      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(37.0902, 95.7129),
        mapTypeId: 'terrain'
      });

      // $http.get("http://localhost:3000/api/collaboration?channel=" + channel + "&startYear=" + start + "&endYear=" + end).then(function(response){
      //   console.log(response.data);
      //
      //
      // });

      var results = [{lat: 19.2218342, long: -155.4438324, title: "pub1"},
        {lat: 40.8443, long: -116.2005, title: "pub2"},
        {lat: 19.4619999, long: -155.5868378, title: "pub3"}];

      // Loop through the results array and place a marker for each
      // set of coordinates.
      for (var i = 0; i < results.length; i++) {
        var publication = results[i];
        var latLng = new google.maps.LatLng(publication.lat,publication.long);
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: publication.title
        });
      }

      $scope.changePCView = "showResult";
    }

  });
