'use strict';

angular.module('issueTracker', [
    'ngRoute',
    'issueTracker.home.dashboard',
    'issueTracker.home.anonymous',
    'issueTracker.users.identity',
    'issueTracker.common',
    'angular-loading-bar',
    'ngAnimate',
    'cgNotify'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}])
.constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/')
.run([
    '$rootScope', 
    '$location',
    '$cookies',
    function($rootScope, $location, $cookies) {
        $rootScope.$on( '$routeChangeStart', function(event, next, current) {
            if($cookies.get('access_token')) {
                if($location.path() === '/')
                $location.path('/dashboard');
            } else {
                $location.path('/');
            }
        });
    }
]);