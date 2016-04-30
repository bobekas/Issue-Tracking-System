angular.module('issueTracker.users.identity', ['ngCookies'])
    .factory('identity', [
        '$cookies',
        '$http',
        '$q',
        'BASE_URL',
        function($cookies, $http, $q, BASE_URL) {
            var accessToken = $cookies.get('access_token');
            var username = $cookies.get('userName');
            
            function getCurrentUser() {
                return {
                    username: username
                }
            }
            
            function isAuthenticated() {
                var deferred = $q.defer();
                
                if(!accessToken) {
                    deferred.reject(false);
                }
                
                var config = {
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                }
                $http.get(BASE_URL + 'users/me', config)
                    .then(function (success) {
                        deferred.resolve(true);
                    }, function(error) {
                        deferred.reject(false);
                    });
                
                return deferred.promise;
            }
            
            return {
                getCurrentUser: getCurrentUser,
                isAuthenticated: isAuthenticated
            };
        }
    ]);