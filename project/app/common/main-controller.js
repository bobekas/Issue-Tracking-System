angular.module('issueTracker.common', [])
    .controller('MainCtrl', [
        '$rootScope',
        '$location',
        'identity',
        'authentication',
        function($rootScope, $location, identity, authentication) {
            $rootScope.logout = function() {
                authentication.logoutUser();
                $location.path('/');
            }
            identity.isAuthenticated()
                .then(function() {
                    $rootScope.isAuthenticated = true;
                }, function() {
                    $rootScope.isAuthenticated = false;
                    $location.path('/');
                });
        }    
    ]);