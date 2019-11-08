
console.log("in main.js");
var app = angular.module("sose-research-community", ["ui.router", "chart.js" /* declare use of module here */]); //this tells the main app the services youre gonna use

//ui-router allows for 'back' functionality 
//state provider allows you to define different states 

app.controller("main-controller", function($scope, $http, $window, $mdDialog, ngNotify) {
	

});

app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('query1', {
		url: '/query1',
		templateUrl: '../HTML/Query1.html',
		controller: "Q1Controller"
	})
	.state('query2', {
		url: '/query2',
		templateUrl: '../HTML/Query2.html',
		controller: "Q2Controller"
	})
	.state('query3', {
		url: '/query3',
		templateUrl: '../HTML/Query3.html',
		controller: "Q3Controller"
	})
	.state('query4', {
		url: '/query4',
		templateUrl: '../HTML/Query4.html',
		controller: "Q4Controller"
	})
	.state('query5', {
		url: '/query5',
		templateUrl: '../HTML/Query5.html',
		controller: "Q5Controller"
	})
	.state('query6', {
		url: '/query6',
		templateUrl: '../HTML/Query6.html',
		controller: "Q6Controller"
	})
	.state('query7', {
		url: '/query7',
		templateUrl: '../HTML/Query7.html',
		controller: "Q7Controller"
	})
	.state('s2query7', {
		url: '/s2/query7',
		templateUrl: '../HTML/S2Q7.html',
		controller: "S2Q7Controller"
	})
	.state('s2query1', {
		url: '/s2/query1',
		templateUrl: '../HTML/S2Q1.html',
		controller: "S2Q1Controller"
	})
	.state('s2query8', {
		url: '/s2/query8',
		templateUrl: '../HTML/S2Q8.html',
		controller: "S2Q8Controller"
	})
	.state('s2query4', {
		url: '/s2/query4',
		templateUrl: '../HTML/S2Q4.html',
		controller: "S2Q4Controller"
	})
	.state('s2query5', {
		url: '/s2/query5',
		templateUrl: '../HTML/S2Q5.html',
		controller: "S2Q5Controller"
	})
	.state('s2query12', {
		url: '/s2/query12',
		templateUrl: '../HTML/S2Q12.html',
		controller: "S2Q12Controller"
	})
	.state('s2query13', {
		url: '/s2/query13',
		templateUrl: '../HTML/S2Q13.html',
		controller: "S2Q13Controller"
	})
	.state('home', {
		url: '/home',
		templateUrl: '../HTML/index.html',
		controller: "main-controller"
	})
	

});
