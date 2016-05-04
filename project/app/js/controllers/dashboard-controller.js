'use strict';

angular.module('issueTracker.home.dashboard', [
    'issueTracker.issuesService'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'app/templates/dashboard.html',
        controller: 'DashboardCtrl'
    });
}])

.controller('DashboardCtrl', [
    '$scope',
    'issuesService',
    function($scope, issuesService) {
        issuesService.getMyIssues(1, 1)
            .then(function(success) {
                console.log(success);
            })
    }
]);