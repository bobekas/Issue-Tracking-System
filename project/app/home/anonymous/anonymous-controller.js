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
    'identity',
    'notify',
    function($scope, $location, authentication, identity, notify) {
        $scope.login = function(user) {
            authentication.loginUser(user)
                .then(function(success) {
                    notify({
                        message: 'Successful!',
                        duration: 2000,
                        classes: ['alert-success']
                    });
                    identity.isAuthenticated();
                    $location.path('/dashboard');
                }, function(error) {
                    notify({
                        message: error,
                        duration: 6000,
                        classes: ['cg-notify-error']
                    });
                });
        }
        
        
        $scope.register = function(user) {
            authentication.registerUser(user)
                .then(function(success) {
                    $scope.login({
                        email: user.Email,
                        password: user.Password
                        });
                }, function(error) {
                    for(var errorMsg in error) {
                        notify({
                            message: error[errorMsg][error[errorMsg].length - 1],
                            duration: 6000,
                            classes: ['cg-notify-error']
                        });
                        break;
                    }
                })
        }
    }]);