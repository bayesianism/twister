describe('MainController', function() {
  beforeEach(module('twister'));

  it('should know that the app is named Twister', inject(function($controller) {
    var scope = {};
    var controller = $controller('MainController', {$scope:scope});
    expect(scope.appName).to.equal('Twister');
  }));

});
