'use strict';
angular.module('foodApp').factory('requestFactory', ['$http', function ($http){
  var foodPlaces = [];
  var drinkPlaces = [];

  // request all places with active food licenses from the database
  var getFoodPlaces = function() {
    return $http.get('https://data.cityofboston.gov/resource/gb6y-34cq.json?$limit=3000&$$app_token=o8G9RFyZIGBbm4xexFrdV0Rfk').then(function(response) {
      angular.copy(response.data, foodPlaces);
    });
  };

  // request all places with active liquor licenses from the database. only the latitude and logitude are stored
  var getDrinkPlaces = function() {
    return $http.get('https://data.cityofboston.gov/resource/hda6-fnsh.json?$limit=3000&$$app_token=o8G9RFyZIGBbm4xexFrdV0Rfk').then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].location !== 'NULL') {
          drinkPlaces.push([getLat(response.data[i].location), getLong(response.data[i].location)]);
        }
      }
    });
  };

  // find the latitude from the location string
  var getLat = function(location) {
    var reg = /\(.*,/;
    location = reg.exec(location)[0];
    location = location.slice(1);
    location = location.slice(0, -1);
    return Number(location);
  };

  // find the longitude from the location string
  var getLong = function(location) {
    var reg = /\s.*\)/;
    location = reg.exec(location)[0];
    location = location.slice(1);
    location = location.slice(0, -1);
    return Number(location);
  };

  return {
    foodPlaces: foodPlaces,
    drinkPlaces: drinkPlaces,
    getFoodPlaces: getFoodPlaces,
    getDrinkPlaces: getDrinkPlaces
  };

}]);
