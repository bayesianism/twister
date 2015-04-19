angular = require('angular');

angular.module('twister.services', [])

.service('sampleService', ['$http', '$q', function($http, $q) {
  var self = this;
  this.data = {}; // cached stats

  this.getCoordinates = function() {
    if(self.data.coordinates) return $q.when(self.data.coordinates);

    return $http.get('/data/sample/map')
    .then(function(res) {
      if (res.data.error) throw new Error('error retrieving user coordinates: '+res.data.error);
      return (self.data.coordinates = res.data.coordinates);
    })
    .catch(function(error) {
      alert('ERROR! '+error); // fail loudly for now
    });
  };
}]);
