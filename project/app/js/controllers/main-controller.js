angular.module('issueTracker.common', [])
    .controller('MainCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$filter',
        'identityService',
        'authService',
        'notify',
        function($rootScope, $scope, $location, $filter, identityService, authService, notify) {
            $rootScope.logout = function() {
                authService.logoutUser();
                notify({
                        message: 'Logout successful!',
                        duration: 4000,
                        classes: ['alert-success']
                    });
                $location.path('/');
            }
            $scope.isActive = function(viewLocation) {
                var path = $location.path();
                return $filter('limitTo')(path, viewLocation.length) === viewLocation;
            }
            identityService.isAuthenticated()
                .then(function(response) {
                    $rootScope.isAuthenticated = true;
                    if(response['isAdmin']) {
                        $rootScope.isAdmin = true;
                    }
                }, function() {
                    $rootScope.isAuthenticated = false;
                    $location.path('/');
                });
        }    
    ]);