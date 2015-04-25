'use strict';

/**
 * @ngdoc function
 * @name foodApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the foodApp
 */
angular.module('foodApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
