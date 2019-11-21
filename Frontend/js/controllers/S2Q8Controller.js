"use strict";
angular.module("sose-research-community")
    .controller("S2Q8Controller", function ($scope, $http, $timeout) {
        $scope.changePCView = "";

        $scope.getResult = function () {
            const keywords = document.getElementById("keywords").value;
            const k = document.getElementById('kNum').value || '10';

            $http.get("/api/paper/top_k?keywords=" + keywords + "&k=" + k).then(function (response) {
                console.log(response.data);
                const resList = response.data;
                const myChart = echarts.init(document.getElementById('echarts'));

                const data = resList.flatMap(paper => {
                    return [{
                        name: paper.title, itemStyle: {
                            color: 'red'
                        }
                    }].concat(paper.authors.map(x => {
                        return {
                            name: x, itemStyle: {
                                color: 'blue'
                            }
                        }
                    }));
                })

                const edges = resList.flatMap(paper => {
                    return paper.authors.map(author => {
                        return {source: paper.title, target: author}
                    })
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
                            edgeLength: 60
                        },
                        edges: edges
                    }]
                };
                myChart.setOption(option);

            });

            $scope.changePCView = "showResult";
        }

    });