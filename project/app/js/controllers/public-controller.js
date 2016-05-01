'use strict';

angular.module('issueTracker.home.public', [
    'issueTracker.users.authService'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app/templates/public.html',
        controller: 'PublicCtrl'
    });
}])

.controller('PublicCtrl', [
    '$scope', 
    '$location',
    'authService',
    'identityService',
    'notify',
    function($scope, $location, authService, identityService, notify) {
        $scope.login = function(user) {
            authService.loginUser(user)
                .then(function(success) {
                    notify({
                        message: 'Successful!',
                        duration: 3000,
                        classes: ['alert-success']
                    });
                    identityService.isAuthenticated();
                    $location.path('/dashboard');
                }, function(error) {
                    notify({
                        message: error,
                        duration: 8000,
                        classes: ['cg-notify-error']
                    });
                });
        }
        
        
        $scope.register = function(user) {
            authService.registerUser(user)
                .then(function(success) {
                    $scope.login({
                        email: user.Email,
                        password: user.Password
                        });
                }, function(error) {
                    for(var errorMsg in error) {
                        notify({
                            message: error[errorMsg][error[errorMsg].length - 1],
                            duration: 8000,
                            classes: ['cg-notify-error']
                        });
                        break;
                    }
                })
        }
    }]);