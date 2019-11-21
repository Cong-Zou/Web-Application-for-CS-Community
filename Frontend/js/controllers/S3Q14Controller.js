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
                        id: paper.title,
                        name: paper.title,
                        itemStyle: null,
                        value: paper.weight,
                        symbolSize: paper.weight,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        x: myChart.getWidth() * Math.random(),
                        y: myChart.getHeight() * Math.random(),
                    }
                })

                const edges = linkList.map(link => {
                    return {source: link.from, target: link.to, lineStyle: {normal: {}}}
                })

                console.log('data', data);
                console.log('edges', edges);

                const option = {
                    tooltip: {},
                    animationDuration: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'none',
                            data: data,
                            links: edges,
                            roam: true,
                            focusNodeAdjacency: true,
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    shadowBlur: 10,
                                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                                }
                            },
                            label: {
                                position: 'right',
                                formatter: '{b}'
                            },
                            lineStyle: {
                                color: 'source',
                                curveness: 0.3
                            },
                            emphasis: {
                                lineStyle: {
                                    width: 10
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option);

            });

            $scope.changePCView = "showResult";
        }

    });