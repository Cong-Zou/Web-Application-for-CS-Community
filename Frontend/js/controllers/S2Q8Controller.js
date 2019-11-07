"use strict";
angular.module("sose-research-community")
    .controller("S2Q8Controller", function ($scope, $http, $timeout) {
        $scope.changePCView = "";

        $scope.getResult = function () {
            const keywords = document.getElementById("keywords").value;
            const k = document.getElementById('kNum').value || '10';

            $http.get("https://diwd-team7.herokuapp.com/api/paper/top_k?keywords=" + keywords + "&k=" + k).then(function (response) {
                console.log(response.data);


            });

            $scope.changePCView = "showResult";
        }

    });