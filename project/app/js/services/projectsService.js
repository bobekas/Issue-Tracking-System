angular.module('issueTracker.users.me.userService', [])
    .factory('userService', [
        '$http',
        '$q',
        'BASE_URL',
        'identityService',
        function ($http, $q, BASE_URL, identityService) {
            function getProject(id) {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();
                
                $http.get(BASE_URL + 'projects/' + id, config)
                    .then(function(project) {
                        resolve(project.data);
                    }, function(error) {
                        reject(error);
                    });
                
                return deferred.promise;
            }    
            
            function getAllProjects() {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();
                
                $http.get(BASE_URL + 'projects', config)
                    .then(function(projects) {
                        console.log(projects);
                        resolve(projects.data);
                    }, function(error) {
                        reject(error);
                    });
                
                return deferred.promise;
            }
            
            function addPoject(project) {
                
            }
            
            return {
                getProject: getProject,
                getAllProjects: getAllProjects,
                addProject: addProject
            }
        }
    ]);