angular.module('issueTracker.users.authService', ['ngCookies'])
    .factory('authService', [
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
                        deferred.resolve(response.user);
                    }, function (error) {
                        deferred.reject(error.data['ModelState']);
                    });
                
                return deferred.promise;
            }    
            
            function loginUser(user) {
                var deferred = $q.defer();
                user = 'grant_type=password&username=' + user.email + '&password=' + user.password;
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
                $cookies.remove('userName');
                $cookies.remove('userId');
                $rootScope.isAuthenticated = false;
            }
            
            return {
                registerUser: registerUser,
                loginUser: loginUser,
                logoutUser: logoutUser
            }
        }
    ]);