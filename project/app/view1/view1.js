'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'app/view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
    $scope.users = [
        {
            username: 'bobekas',
            name: 'Boyan',
            registerDate: new Date(2015, 0, 2)
        },
        {
            username: 'zosho',
            name: 'zeorgi',
            registerDate: new Date(2013, 3, 3)
        },
        {
            username: 'petar',
            name: 'Petar',
            registerDate: new Date(2013, 3, 3)
        },
        {
            username: 'zattaka',
            name: 'Ivan',
            registerDate: new Date(2013, 3, 3)
        },
        {
            username: 'gattaka',
            name: 'Ivan',
            registerDate: new Date(2013, 3, 3)
        }
    ];
    $scope.myFunc = function() {
      console.log("Clicked!");
    }
}]);