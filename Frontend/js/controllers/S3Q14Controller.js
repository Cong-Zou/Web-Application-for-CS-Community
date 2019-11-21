"use strict";
angular.module("sose-research-community")
    .controller("S3Q14Controller", function ($scope, $http, $timeout) {
        $scope.changePCView = "";

        $scope.getResult = function () {
            const keywords = document.getElementById("keywords").value;

            $http.get("/api/paper/interested?keywords=" + keywords).then(function (response) {
                console.log(response.data);
                const myChart = echarts.init(document.getElementById('echarts'));

                const paperList = response.data.paperList;
                const linkList = response.data.linkList;
                const data = paperList.map(paper => {
                    return {
                        name: paper.title,
                        itemStyle: {
                            color: 'red'
                        }
                    }
                })

                const edges = linkList.map(link => {
                    return {source: link.from, target: link.to}
                })

                console.log('data', data);
                console.log('edges', edges);

                const option = {
                    series: [{
                        symbolSize: 40,
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        type: 'graph',
                        layout: 'force',
                        animation: false,
                        data: data,
                        force: {
                            repulsion: 100,
                            edgeLength: 160
                        },
                        edges: edges
                    }]
                };
                myChart.setOption(option);

            });

            $scope.changePCView = "showResult";
        }

    });