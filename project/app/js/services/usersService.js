angular.module('issueTracker.users.me.usersService', [])
    .factory('usersService', [
        '$http',
        '$q',
        'BASE_URL',
        'identityService',
        function ($http, $q, BASE_URL, identityService) {
            function changePassword(data) {
                var deferred = $q.defer();      
                
                var config = identityService.getAuthHeaderConfig();
                
                $http.post(BASE_URL + 'api/Account/ChangePassword', data, config)
                    .then(function(response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error.data['ModelState']);
                    });
                
                return deferred.promise;
            }  
            
            function getAllUsers() {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();
                
                $http.get(BASE_URL + 'users', config)
                    .then(function(users) {
                        deferred.resolve(users.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    
                return deferred.promise;
            }  
            
            return {
                changePassword: changePassword,
                getAllUsers: getAllUsers
            }
        }
    ]);