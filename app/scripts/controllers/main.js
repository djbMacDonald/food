'use strict';

/**
 * @ngdoc function
 * @name foodApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the foodApp
 */
angular.module('foodApp').controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['requestFactory', '$q'];


function MainCtrl (requestFactory, $q) {
  var vm = this;
  vm.foodPlaces = requestFactory.foodPlaces;
  vm.drinkPlaces = requestFactory.drinkPlaces;
  vm.year = 2006;
  vm.circles = [];

  vm.getData = function() {
    $q.all([requestFactory.getFoodPlaces(), requestFactory.getDrinkPlaces()]).then(vm.drawFood);
  };

  vm.updateSlider = function() {
    $('#sliderLabel').val(vm.year);
    vm.drawFood();
  };

  vm.pastDate = function(store) {
    return Number(store.licenseadddttm.substring(0,4)) >= $('#yearSlider').val();
  };

  vm.formatPhone = function(string) {
    string = string.slice(2);
    return string.substring(0,3) + '-' + string.substring(3,6) + '-' + string.substring(6,string.length);
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

  vm.drawFood = function() {
    var infoWindow;
      for (var i = 0; i < vm.circles.length; i++) {
        vm.circles[i].setMap(null);
      }

    var filteredFoodPlaces = vm.foodPlaces.filter(vm.pastDate);

    for (var i = 0; i < filteredFoodPlaces.length - 1; i++) {
      var color = (function() {
        for (var j = 0; j < vm.drinkPlaces.length - 1; j++) {
          if (vm.drinkPlaces[j][0] === Number(filteredFoodPlaces[i].location.latitude) && vm.drinkPlaces[j][1] === Number(filteredFoodPlaces[i].location.longitude)) {
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
        name: filteredFoodPlaces[i].businessname,
        address: filteredFoodPlaces[i].address,
        city: filteredFoodPlaces[i].city,
        phone: vm.formatPhone(filteredFoodPlaces[i].dayphn),
        center: { lat: Number(filteredFoodPlaces[i].location.latitude), lng: Number(filteredFoodPlaces[i].location.longitude) },
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

      vm.circles.push(circle);
    }
  };

  vm.initialize();
  vm.getData();
}


