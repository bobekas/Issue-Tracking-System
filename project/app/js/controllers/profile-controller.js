angular.module('issueTracker.users.me.profile', [
    'issueTracker.users.me.usersService'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/profile/password', {
        templateUrl: 'app/templates/change-password.html',
        controller: 'ChangePasswordCtrl'
    });
}])

.controller('ChangePasswordCtrl', [
    '$scope',
    'usersService',
    'notify',
    function($scope, usersService, notify) {
        $scope.changePassword = function(user) {
            usersService.getAllUsers();
            usersService.changePassword(user)
                .then(function(success) {
                    notify({
                        message: 'Your password has been changed.',
                        duration: 8000,
                        classes: ['alert-success']
                    });
                    $scope.user = null;
                    $scope.editProfileForm.$setPristine();
                }, function(error) {
                    for(var errorMsg in error) {
                        notify({
                            message: error[errorMsg][error[errorMsg].length - 1],
                            duration: 8000,
                            classes: ['cg-notify-error']
                        });
                        break;
                    }
                });
        }
    }
])