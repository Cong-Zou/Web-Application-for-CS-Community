"use strict";
angular.module("sose-research-community")
  .controller("S2Q13Controller", function($scope, $http, $timeout) {

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

      $http.get("http://localhost:3000/api/map/channel?channel=" + channel + "&startYear=" + start + "&endYear=" + end).then(function(response){
        console.log(response.data);
        const results = response.data;

        // Loop through the results array and place a marker for each
        // set of coordinates.
        for (var i = 0; i < results.length; i++) {
          var publication = results[i];
          var latLng = new google.maps.LatLng(publication.lat,publication.lng);
          var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: publication.title
          });
        }
      });
    }

  });
