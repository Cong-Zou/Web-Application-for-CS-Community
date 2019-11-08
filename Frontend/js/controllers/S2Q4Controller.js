"use strict";
angular.module("sose-research-community")
    .controller("S2Q4Controller", function ($scope, $http, $timeout) {
        $scope.changePCView = "";

        $scope.getResult = function () {
            const startYear = document.getElementById("startYear").value;
            const endYear = document.getElementById("endYear").value;

            $http.get(`/api/paper/categorize?startYear=${startYear}&endYear=${endYear}`).then(function (response) {
                console.log(response.data);
                const resList = response.data;
                const myChart = echarts.init(document.getElementById('echarts'));
                myChart.hideLoading();
                const cdata = resList.map(category => {
                    return {
                        name: category.name, children: category.papers.map(paper => {
                            return {name: paper.title}
                        })
                    }
                })

                const data = {name: 'root', children: cdata}
                console.log('data', data);

                const option = {
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove'
                    },
                    series: [
                        {
                            type: 'tree',
                            data: [data],
                            top: '18%',
                            bottom: '14%',
                            layout: 'radial',
                            symbol: 'emptyCircle',
                            symbolSize: 7,
                            initialTreeDepth: 3,
                            animationDurationUpdate: 750
                        }
                    ]
                };
                myChart.setOption(option);

            });

            $scope.changePCView = "showResult";
        }

    });