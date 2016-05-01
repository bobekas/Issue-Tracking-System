angular.module('issueTracker.users.identityService', ['ngCookies'])
    .factory('identityService', [
        '$cookies',
        '$http',
        '$q',
        'BASE_URL',
        function($cookies, $http, $q, BASE_URL) {            
            function getCurrentUser() {
                return {
                    username: $cookies.get('userName'),
                    userId: $cookies.get('userId'),
                    accessToken: $cookies.get('access_token')
                }
            }
            
            function getUserAuth() {
                return $cookies.get('access_token');
            }
            
            function isAuthenticated() {
                var deferred = $q.defer();
                
                var user = getCurrentUser();
                
                if(!user.accessToken) {
                    deferred.reject(false);
                }
                
                var config = {
                    headers: {
                        'Authorization': 'Bearer ' + user.accessToken
                    }
                }
                $http.get(BASE_URL + 'users/me', config)
                    .then(function (response) {
                        if(!$cookies.get('userId')) {
                            $cookies.put('userId', response.data.Id);
                        }
                        deferred.resolve(response.data);
                    }, function(error) {
                        if(error.statusText === 'Unauthorized') {
                            $cookies.remove('access_token');
                            $cookies.remove('userName');
                            $cookies.remove('userId');
                        }
                        deferred.reject(error);
                    });
                
                return deferred.promise;
            }
            
            return {
                getCurrentUser: getCurrentUser,
                getUserAuth: getUserAuth,
                isAuthenticated: isAuthenticated
            };
        }
    ]);