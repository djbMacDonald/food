'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('foodApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    var canvas = $('<div id=map-canvas>');
    $(document.body).append(canvas);
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  // it('should have a starting year', function () {
  //   expect(MainCtrl.year).toBe(2006);
  // });

  //   it('should format phone numbers', function () {
  //   expect(MainCtrl.formatPhone('+6175551234')).toBe('617-555-1234');
  // });
});
