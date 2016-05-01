'use strict';

angular.module('issueTracker.home.dashboard', [])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'app/templates/dashboard.html',
        controller: 'DashboardCtrl'
    });
}])

.controller('DashboardCtrl', [
    '$scope',
    function($scope) {
        
    }
]);