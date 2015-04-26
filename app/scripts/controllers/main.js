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

  vm.drinks = [];

  vm.year = 2006;

  vm.getData = function() {
    $http.get('https://data.cityofboston.gov/resource/hda6-fnsh.json').success(function(data){
      vm.drinkLocations(data);
      vm.getFood();
    });
  };

  vm.getFood = function() {
    $http.get('https://data.cityofboston.gov/resource/gb6y-34cq.json').success(function(data){
        vm.drawFood(data);
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

    var infoWindow;

    for (var i = 0; i < data.length - 1; i++) {
      var color = (function() {
        for (var j = 0; j < vm.drinks.length - 1; j++) {
          if (vm.drinks[j][0] === Number(data[i].location.latitude) && vm.drinks[j][1] === Number(data[i].location.longitude)) {
            return '#0000FF';
          }
        }
        return '#FF0000';
      })();

      var circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.6,
        clickable: true,
        map: vm.map,
        name: data[i].businessname,
        address: data[i].address,
        city: data[i].city,
        phone: vm.formatPhone(data[i].dayphn),
        center: { lat: Number(data[i].location.latitude), lng: Number(data[i].location.longitude) },
        radius: 10
      });

      google.maps.event.addListener(circle, 'click', function(ev){
        if (infoWindow) {
          infoWindow.close();
        }
        infoWindow = new google.maps.InfoWindow({
          content: '<div class="info"><h2>' + this.name + '</h2><h3>' + this.address + ', ' + this.city + '</h3><h4>Phone: ' + this.phone + '</h4></div>'
        });
        infoWindow.setPosition(ev.latLng);
        infoWindow.open(vm.map);
      });
    }
  };

  vm.drinkLocations = function(data) {
    vm.drinks = [];
    for (var i = 0; i < data.length - 1; i++) {
      if (data[i].location !== 'NULL') {
        vm.drinks.push([vm.getLat(data[i].location), vm.getLong(data[i].location)]);
      }
    }
  };

  vm.getLat = function(location) {
    var reg = /\(.*,/;
    location = reg.exec(location)[0];
    location = location.slice(1);
    location = location.slice(0, -1);
    return Number(location);
  };

  vm.getLong = function(location) {
    var reg = /\s.*\)/;
    location = reg.exec(location)[0];
    location = location.slice(1);
    location = location.slice(0, -1);
    return Number(location);
  };

  vm.formatPhone = function(string) {
    string = string.slice(2);
    return string.substring(0,3) + '-' + string.substring(3,6) + '-' + string.substring(6,string.length);
  };

  vm.updateSlider = function() {
    $('#sliderLabel').val(vm.year);
  };

  // google.maps.event.addDomListener(window, 'load', vm.initialize);

});


