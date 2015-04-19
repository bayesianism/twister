var angular = require('angular');
require('angular-route');
require('./controllers');
require('./services');
require('./directives');

var app = angular.module('twister', ['twister.services', 'twister.directives', 'twister.controllers', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: '/html/main.html',
    controller: 'MainController'
  })
  .when('/charts', {
    templateUrl: '/html/charts.html',
    controller: 'ChartsController'
  })
  .otherwise({
    redirectTo: '/main'
  });
}]);
