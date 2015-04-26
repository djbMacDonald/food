'use strict';
angular.module('foodApp').factory('requestFactory', ['$http', function($http){
  var foodPlaces = [];
  var drinkPlaces = [];

  var getFoodPlaces = function() {
    return $http.get('https://data.cityofboston.gov/resource/gb6y-34cq.json').then(function(response) {
      angular.copy(response.data, foodPlaces);
      console.log(foodPlaces);
    });
  };

  var getDrinkPlaces = function() {
    return $http.get('https://data.cityofboston.gov/resource/hda6-fnsh.json').then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].location !== "NULL") {
          drinkPlaces.push([getLat(response.data[i].location), getLong(response.data[i].location)]);
        }
      }
      console.log(drinkPlaces);
    });
  };

  var getLat = function(location) {
    var reg = /\(.*,/;
    location = reg.exec(location)[0];
    location = location.slice(1);
    location = location.slice(0, -1);
    return Number(location);
  };

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
