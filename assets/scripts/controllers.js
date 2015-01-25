angular = require('angular');

angular.module('twister.controllers', [])

.controller('MainController', ['$scope', function($scope) {
  $scope.appName = 'Twister';
}]);
