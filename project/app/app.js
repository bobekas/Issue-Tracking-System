'use strict';

angular.module('issueTracker', [
  'ngRoute',
  'myApp.view1',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
