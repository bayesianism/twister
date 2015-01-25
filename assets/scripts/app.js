var angular = require('angular');
require('angular-route');
require('./controllers');

var app = angular.module('twister', ['twister.controllers', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: '/html/main.html',
    controller: 'MainController'
  })
  .otherwise({
    redirectTo: '/main'
  });
}]);
