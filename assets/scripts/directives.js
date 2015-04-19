angular = require('angular');
require('angular-google-chart');

angular.module('twister.directives', ['googlechart'])

.directive('geoChart', function() {
  return {
    restrict: 'E',
    template: '<div google-chart chart="geo" style="{{cssStyle}}"></div>',
    replace: true,
    controller: ['$scope', 'sampleService', function($scope, sampleService) {
      sampleService.getCoordinates()
      .then(function(coordinates) {
        $scope.geo = {
          type: "GeoChart",
          displayed: true,
          data: coordinates
          };
      });
    }]
  };
});
