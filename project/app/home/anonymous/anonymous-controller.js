'use strict';

angular.module('issueTracker.home.anonymous', [
    'issueTracker.users.authentication'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app/home/anonymous/anonymous.html',
        controller: 'AnonymousCtrl'
    });
}])

.controller('AnonymousCtrl', [
    '$scope', 
    '$location',
    'authentication',
    function($scope, $location, authentication) {
        $scope.login = function(user) {
            user = 'grant_type=password&username=' + user.email + '&password=' + user.password;
            authentication.loginUser(user)
                .then(function(success) {
                    if(success) {
                        $location.path('/dashboard');
                    }
                }, function(error) {
                    $scope.message = error;
                });
        }
        
        
        $scope.register = function(user) {
            authentication.registerUser(user);
        }
    }]);