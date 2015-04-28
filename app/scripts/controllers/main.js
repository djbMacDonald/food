'use strict';

/**
 * @ngdoc function
 * @name foodApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the foodApp
 */
angular.module('foodApp').controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['requestFactory', '$q', '$timeout'];

function MainCtrl (requestFactory, $q, $timeout) {
  var vm = this;
  var infoWindow;
  vm.foodPlaces = requestFactory.foodPlaces;
  vm.drinkPlaces = requestFactory.drinkPlaces;
  vm.year = 2006;
  vm.circles = [];
  vm.visual = 'Circles';

  // make requests to the food database and the drink database. once both responses come in, draw the appropriate circles
  vm.getData = function() {
    return $q.all([requestFactory.getFoodPlaces(), requestFactory.getDrinkPlaces()])
    .then(function() {
      vm.createCircles();
      vm.addPoints();
    });
  };

  // update the map when the year slider is moved
  vm.updateSlider = function() {
    if (vm.visual === 'Circles') {
      if ($('#sliderLabel').val() > vm.year) {
        $timeout(vm.removePoints);
      } else {
        $timeout(vm.addPoints);
      }
    } else {
      $timeout(vm.setHeatmap);
    }
    $('#sliderLabel').val(vm.year);
  };

  // switch between circles and heatmap
  vm.toggleVisual = function() {
    if (vm.visual === 'Circles') {
      vm.visual = 'Heatmap';
      vm.setHeatmap();
    } else {
      vm.visual = 'Circles';
      vm.heatmap.setMap(null);
      vm.showCircles();
    }
  };

  // points are added when the slider moves right.
  vm.addPoints = function() {
    for (var i = 0; i < vm.circles.length; i++) {
      if (vm.circles[i].year === Number(vm.year)) {
        vm.circles[i].setMap(vm.map);
        google.maps.event.addListener(vm.circles[i], 'click', vm.showInfoWindow);
      }
    }
  };

  // points are removed when the slider moves left.
  vm.removePoints = function() {
    for (var i = 0; i < vm.circles.length; i++) {
      if (vm.circles[i].year === Number(vm.year) + 1) {
        vm.circles[i].setMap(null);
        google.maps.event.clearListeners(vm.circles[i], 'click');
      }
    }
  };

  // changes phone numbers to be more readable
  vm.formatPhone = function(string) {
    string = string.slice(2);
    return string.substring(0,3) + '-' + string.substring(3,6) + '-' + string.substring(6,string.length);
  };

  // shows the Google map, then draws the city border
  vm.makeMap = function() {
    var mapOptions = {
      center: { lat: 42.3601, lng: -71.0589 }, zoom: 15
    };

    vm.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $.getJSON('data/citylimit.topojson', function(data){
        var geoJsonObject = topojson.feature(data, data.objects.collection);
        vm.map.data.addGeoJson(geoJsonObject);
      });

    vm.map.data.setStyle({
      fillColor: 'red',
      fillOpacity: 0.06,
      strokeColor: 'red',
      strokeWeight: 1
    });

  };

  // picks the color for a circle. blue if the place also has a liquor license, red if not
  vm.chooseColor = function(i) {
    for (var j = 0; j < vm.drinkPlaces.length - 1; j++) {
      if (vm.drinkPlaces[j][0] === Number(vm.foodPlaces[i].location.latitude) && vm.drinkPlaces[j][1] === Number(vm.foodPlaces[i].location.longitude)) {
        return '#0000FF';
      }
    }
    return '#FF0000';
  };

  // creates circles from the database results, then pushes them into an array
  vm.createCircles = function() {
    for (var i = 0; i < vm.foodPlaces.length; i++) {
      var color = vm.chooseColor(i);
      var placeYear = Number(vm.foodPlaces[i].licenseadddttm.substring(0,4));
      var location = { lat: Number(vm.foodPlaces[i].location.latitude), lng: Number(vm.foodPlaces[i].location.longitude) };
      // if (location.lat === 0) {
      //   location = vm.geoAddress(vm.foodPlaces[i].address + ' Boston MA');
      // }

      var circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.6,
        clickable: true,
        name: vm.foodPlaces[i].businessname,
        address: vm.foodPlaces[i].address,
        city: vm.foodPlaces[i].city,
        phone: vm.formatPhone(vm.foodPlaces[i].dayphn),
        year: placeYear,
        center: location,
        radius: 10
      });

      vm.circles.push(circle);
    }
  };

  //if the database does not have the lat/long of an establishment, uses google geocoder to find the coordinates from the given address. unfortunately this runs over google's geocoding query rate limit

  // vm.geoAddress = function(address) {
  //   var geocoder = new google.maps.Geocoder();
  //   geocoder.geocode( {address:address}, function(results, status) {
  //   console.log(status);
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       return {lat: results[0].geometry.location.k, lng: results[0].geometry.location.D};
  //     } else {
  //       return {lat: 0, lng: 0};
  //     }
  //   });
  // };

  // function attached to circles on click events. first removes any open info windows, then opens a window in the correct place with the place's info
  vm.showInfoWindow = function(ev) {
    if (vm.infoWindow) {
      vm.infoWindow.close();
    }
    vm.infoWindow = new google.maps.InfoWindow({
      content: '<div class="info"><h2>' + this.name + '</h2><h3>' + this.address + ', ' + this.city + '</h3><h4>Phone: ' + this.phone + '</h4></div>'
    });
    vm.infoWindow.setPosition(ev.latLng);
    vm.infoWindow.open(vm.map);
  };

  // draws a heatmap based on the places from the correct years
  vm.setHeatmap = function() {
    var heatArray = [];

    for (var i = 0; i < vm.circles.length; i++) {
      vm.circles[i].setMap(null);
      google.maps.event.clearListeners(vm.circles[i], 'click');
    }

    if (vm.heatmap) {
      vm.heatmap.setMap(null);
    }

    for (var i = 0; i < vm.foodPlaces.length; i++) {
      var placeYear = Number(vm.foodPlaces[i].licenseadddttm.substring(0,4));
      if (placeYear <= Number(vm.year)) {
        heatArray.push(new google.maps.LatLng(Number(vm.foodPlaces[i].location.latitude), Number(vm.foodPlaces[i].location.longitude)));
      }
    }

    var pointArray = new google.maps.MVCArray(heatArray);
    vm.heatmap = new google.maps.visualization.HeatmapLayer({data: pointArray});

    vm.heatmap.setMap(vm.map);
    vm.heatmap.set('radius', 50);
    vm.heatmap.set('maxIntensity', 10);
  };

  // shows circles from places from the correct years
  vm.showCircles = function() {
    for (var i = 0; i < vm.circles.length; i++) {
      if (vm.circles[i].year <= Number(vm.year)) {
        vm.circles[i].setMap(vm.map);
        google.maps.event.addListener(vm.circles[i], 'click', vm.showInfoWindow);
      }
    }
  };


  // when the app starts up, show the google map, make the data requests, then draw the appropriate circles
  vm.makeMap();
  vm.getData();
}


