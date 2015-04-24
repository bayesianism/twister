angular = require('angular');

angular.module('twister.controllers', ['ngMdIcons','ngMaterial'])

.controller('MainController', ['$scope','$mdDialog', function($scope, $mdDialog) {
  $scope.appName = 'Twister';
  $scope.alert = '';

  $scope.aboutUs = function(ev) {
    $mdDialog.show({
      controller: DialogController ,
      templateUrl: '/html/aboutUs.html',
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = '';
    }, function() {
      $scope.alert = '';
    });
  };


 $scope.logIn = function(ev) {
   $mdDialog.show({
     controller: DialogController,
     templateUrl: '/html/logIn.html',
     targetEvent: ev,
   })
   .then(function(answer) {
     $scope.alert = '';
   }, function() {
     $scope.alert = '';
   });
 };

 function DialogController($scope, $mdDialog) {
   $scope.hide = function() {
     $mdDialog.hide();
   };
   $scope.cancel = function() {
     $mdDialog.cancel();
   };
   $scope.answer = function(answer) {
     $mdDialog.hide(answer);
   };
 }


}])
.controller('ChartsController', ['$scope', function($scope) {

}]);
