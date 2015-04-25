'use strict';

/**
 * @ngdoc function
 * @name foodApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the foodApp
 */
angular.module('foodApp').controller('MainCtrl', function ($http) {
  var vm = this;

  vm.places = ['here', 'there', 'everywhere'];

  vm.getFood = function() {
    $http.get('https://data.cityofboston.gov/resource/gb6y-34cq.json').success(function(data){
        vm.drawFood(data, '#FF0000');
    });
  };

  vm.getDrink = function() {
    $http.get('https://data.cityofboston.gov/resource/hda6-fnsh.json').success(function(data){
        vm.drawDrink(data, '#0000FF');
    });
  };

  vm.initialize = function() {

    var mapOptions = {
      center: { lat: 42.3601, lng: -71.0589 }, zoom: 14
    };

    vm.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $.getJSON("data/citylimit.topojson", function(data){
        var geoJsonObject = topojson.feature(data, data.objects.collection)
        vm.map.data.addGeoJson(geoJsonObject);
      });

    vm.map.data.setStyle({
      fillColor: 'red',
      fillOpacity: 0.06,
      strokeColor: 'red',
      strokeWeight: 1
    });

  };

  vm.drawFood = function(data) {
    for (var i = 0; i < data.length - 1; i++) {
      var circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.6,
        map: vm.map,
        center: { lat: Number(data[i].location.latitude), lng: Number(data[i].location.longitude) },
        radius: 10
      });
    }
  };

  vm.drawDrink = function(data) {
    for (var i = 0; i < data.length - 1; i++) {
      if (data[i].location !== 'NULL') {
        var foundLat = vm.getLat(data[i].location);
        var foundLong = vm.getLong(data[i].location);
        var circle = new google.maps.Circle({
          strokeColor: '#0000FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#0000FF',
          fillOpacity: 0.6,
          map: vm.map,
          center: { lat: foundLat, lng: foundLong },
          radius: 10
        });
      }
    }
  };

  vm.getLat = function(string) {
    var reg = /\(.*,/;
    var lat = reg.exec(string)[0];
    lat = lat.slice(1);
    lat = lat.slice(0, -1);
    return Number(lat);
  };

  vm.getLong = function(string) {
    var reg = /\s.*\)/;
    var lat = reg.exec(string)[0];
    lat = lat.slice(1);
    lat = lat.slice(0, -1);
    return Number(lat);
  };

  google.maps.event.addDomListener(window, 'load', vm.initialize);

});


