
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
	.state('query27', {
		url: '/query27',
		templateUrl: '../HTML/Query27.html',
		controller: "Q27Controller"
	})
	.state('home', {
		url: '/home',
		templateUrl: '../HTML/index.html',
		controller: "main-controller"
	})
	

});
