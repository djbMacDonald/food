'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('foodApp'));

  var MainCtrl, scope, circleArray, foodArray, drinkArray;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    var canvas = $('<div id=map-canvas>');
    $(document.body).append(canvas);
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
    circleArray = [
      new google.maps.Circle({year: 2006, center: {lat: 1, lng: 2}}),
      new google.maps.Circle({year: 2007, center: {lat: 1, lng: 2}}),
      new google.maps.Circle({year: 2008, center: {lat: 1, lng: 2}})
    ];
    foodArray = [
      {businessname: 'place1', licenseadddttm: '2006, day, month, time', address: 'here', city: 'Boston', location: {latitude: 1, longitude: 2}, dayphn:'+12223334444'},
      {businessname: 'place2', licenseadddttm: '2007, day, month, time', address: 'there', city: 'Dorchester', location: {latitude: 3, longitude: 4}, dayphn:'+12223334444'},
      {businessname: 'place3', licenseadddttm: '2008, day, month, time', address: 'elsewhere', city: 'Chinatown', location: {latitude: 5, longitude: 6}, dayphn:'+12223334444'}
    ];
    drinkArray = [[3,4],[6,5],[5,7],[1,6]];
  }));

  it('should have a starting year', function () {
    expect(MainCtrl.year).toBe(2006);
  });

  it('should start on circle visualization', function () {
    expect(MainCtrl.visual).toBe('Circles');
  });

  it('should be able to switch between circles and heatmap', function() {
    MainCtrl.toggleVisual();
    expect(MainCtrl.visual).toBe('Heatmap');
  });

  it('should be able to add points to the map', function() {
    MainCtrl.circles = circleArray;
    circleArray[0].setMap(MainCtrl.map);
    expect(circleArray[0].getMap()).toBeTruthy();
    expect(circleArray[1].getMap()).toBeFalsy();
    expect(circleArray[2].getMap()).toBeFalsy();

    MainCtrl.year = 2007;
    MainCtrl.addPoints();
    expect(circleArray[0].getMap()).toBeTruthy();
    expect(circleArray[1].getMap()).toBeTruthy();
    expect(circleArray[2].getMap()).toBeFalsy();
  });

  it('should be able to remove points from the map', function() {
    MainCtrl.circles = circleArray;
    circleArray[0].setMap(MainCtrl.map);
    circleArray[1].setMap(MainCtrl.map);
    expect(circleArray[0].getMap()).toBeTruthy();
    expect(circleArray[1].getMap()).toBeTruthy();
    expect(circleArray[2].getMap()).toBeFalsy();

    MainCtrl.year = 2006;
    MainCtrl.removePoints();
    expect(circleArray[0].getMap()).toBeTruthy();
    expect(circleArray[1].getMap()).toBeFalsy();
    expect(circleArray[2].getMap()).toBeFalsy();
  });

  it('should format phone numbers', function () {
    expect(MainCtrl.formatPhone('+16175551234')).toBe('617-555-1234');
  });

  it('should set circle color to blue if it does has a liquor license', function() {
    MainCtrl.foodPlaces = foodArray;
    MainCtrl.drinkPlaces = drinkArray;
    expect(MainCtrl.chooseColor(1)).toBe('#0000FF');
  });

  it('should set circle color to red if it does not have a liquor license', function() {
    MainCtrl.foodPlaces = foodArray;
    MainCtrl.drinkPlaces = drinkArray;
    expect(MainCtrl.chooseColor(2)).toBe('#FF0000');
  });

  it('should populate an array of circles', function() {
    MainCtrl.foodPlaces = foodArray;
    MainCtrl.drinkPlaces = drinkArray;
    MainCtrl.createCircles();
    expect(MainCtrl.circles.length).toBe(3);
  });

  it('should attached click event listeners to each circle', function() {
    spyOn(MainCtrl, "showInfoWindow");

    MainCtrl.circles = circleArray;
    MainCtrl.year = 2015;
    MainCtrl.showCircles();
    for (var i = 0; i < MainCtrl.circles.length; i++) {
      google.maps.event.trigger(MainCtrl.circles[i], 'click');
    }
    expect(MainCtrl.showInfoWindow.calls.count()).toBe(MainCtrl.circles.length);
  });

});
