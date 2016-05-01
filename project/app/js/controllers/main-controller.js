angular.module('issueTracker.common', [])
    .controller('MainCtrl', [
        '$rootScope',
        '$location',
        'identityService',
        'authService',
        'notify',
        function($rootScope, $location, identityService, authService, notify) {
            $rootScope.logout = function() {
                authService.logoutUser();
                notify({
                        message: 'Logout successful!',
                        duration: 3000,
                        classes: ['alert-success']
                    });
                $location.path('/');
            }
            identityService.isAuthenticated()
                .then(function() {
                    $rootScope.isAuthenticated = true;
                }, function() {
                    $rootScope.isAuthenticated = false;
                    $location.path('/');
                });
        }    
    ]);