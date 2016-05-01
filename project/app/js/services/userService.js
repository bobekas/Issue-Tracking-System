angular.module('issueTracker.users.me.userService', [])
    .factory('userService', [
        '$http',
        '$q',
        'BASE_URL',
        'identityService',
        function ($http, $q, BASE_URL, identityService) {
            function changePassword(data) {
                var deferred = $q.defer();      
                
                var config = {
                    headers: {
                        'Authorization': 'Bearer ' + identityService.getUserAuth()
                    }
                }
                
                $http.post(BASE_URL + 'api/Account/ChangePassword', data, config)
                    .then(function(response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error.data['ModelState']);
                    });
                
                return deferred.promise;
            }    
            
            return {
                changePassword: changePassword
            }
        }
    ]);