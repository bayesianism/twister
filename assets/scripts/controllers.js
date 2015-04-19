angular = require('angular');

angular.module('twister.controllers', [])

.controller('MainController', ['$scope', function($scope) {
  $scope.appName = 'Twister';
}])

.controller('ChartsController', ['$scope', function($scope) {

}]);
