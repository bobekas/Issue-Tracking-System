angular.module('issueTracker.users.authentication', ['ngCookies'])
    .factory('authentication', [
        '$http',
        '$q',
        '$cookies',
        '$rootScope',
        'BASE_URL',
        function ($http, $q, $cookies, $rootScope, BASE_URL) {
            function registerUser(user) {
                var deferred = $q.defer();
                
                $http.post(BASE_URL + 'api/Account/Register', user)
                    .then(function(response) {
                        $cookies.put('access_token', response.data.access_token);
                        $cookies.put('userName', response.data.userName);
                        $rootScope.isAuthenticated = true;
                        deferred.resolve(response.data);
                    }, function (error) {

                    });
                
                return deferred.promise;
            }    
            
            function loginUser(user) {
                var deferred = $q.defer();
                
                $http.post(BASE_URL + 'api/Token', user)
                    .then(function(response) {
                        $cookies.put('access_token', response.data.access_token);
                        $cookies.put('userName', response.data.userName);
                        $rootScope.isAuthenticated = true;
                        deferred.resolve(response.data);
                    }, function(error) {
                        deferred.reject(error.data['error_description']);
                    });
                
                return deferred.promise;
            }
            
            function logoutUser() {
                $cookies.remove('access_token');
                $rootScope.isAuthenticated = false;
            }
            
            return {
                registerUser: registerUser,
                loginUser: loginUser,
                logoutUser: logoutUser
            }
        }
    ]);