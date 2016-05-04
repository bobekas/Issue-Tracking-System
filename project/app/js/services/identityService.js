angular.module('issueTracker.users.identityService', ['ngCookies'])
    .factory('identityService', [
        '$cookies',
        '$http',
        '$q',
        'BASE_URL',
        '$rootScope',
        function($cookies, $http, $q, BASE_URL, $rootScope) {            
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
            
            function getUserId() {
                return $cookies.get('userId');
            }
            
            function getAuthHeaderConfig() {
                return {
                    headers: {
                        'Authorization': 'Bearer ' + getUserAuth()
                    }
                }
            }
            
            function isAuthenticated() {
                var deferred = $q.defer();
                
                var user = getCurrentUser();
                
                if(!user.accessToken) {
                    deferred.reject(false);
                }
                
                var config = getAuthHeaderConfig();
                
                $http.get(BASE_URL + 'users/me', config)
                    .then(function (response) {
                        if(!$cookies.get('userId')) {
                            $rootScope.userId = response.data.Id;
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
            
            function isAdmin() {
                var deferred = $q.defer();
                
                var user = getCurrentUser();
                
                if(!user.accessToken) {
                    deferred.reject(false);
                }
                
                var config = getAuthHeaderConfig();
                
                $http.get(BASE_URL + 'users/me', config)
                    .then(function (response) {
                        if(response.data['isAdmin']) {
                            deferred.resolve(true);
                        } else {
                            deferred.reject(false);
                        }
                    }, function(error) {
                        deferred.reject(error);
                    });
                
                return deferred.promise;
            }
            
            return {
                getCurrentUser: getCurrentUser,
                getUserAuth: getUserAuth,
                getUserId: getUserId,
                getAuthHeaderConfig: getAuthHeaderConfig,
                isAuthenticated: isAuthenticated,
                isAdmin: isAdmin
            };
        }
    ]);