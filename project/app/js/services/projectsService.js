angular.module('issueTracker.projectsService', [])
    .factory('projectsService', [
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
                        deferred.resolve(project.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                
                return deferred.promise;
            }    
            
            function getLeadId(id) {
                var deferred = $q.defer();
                
                getProject(id)
                    .then(function(project) {
                        deferred.resolve(project.Lead.Id);
                    }, function(error) {
                        deferred.reject(error);
                    });
                    
                return deferred.promise;
            }
            
            function getAllProjects() {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();
                
                $http.get(BASE_URL + 'projects', config)
                    .then(function(projects) {
                        deferred.resolve(projects.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                
                return deferred.promise;
            }
            
            function getMyProjects(pageSize, pageNumber) {
                var deferred = $q.defer();
                identityService.isAuthenticated()
                    .then(function() {
                        var userId = identityService.getUserId();
                        
                        var config = identityService.getAuthHeaderConfig();
                
                        $http.get(BASE_URL + 'projects?pageSize=' + pageSize + '&pageNumber=' + pageNumber + '&filter="' + userId + '" == Lead.Id', config)
                            .then(function(success) {
                                deferred.resolve(success.data)
                            }, function(error) {
                                reject(error);
                            });
                        
                    });
                    return deferred.promise;
            }
            
            function addProject(project) {    
                var projectData = parseProjectToUrlEncoded(project);

                var deferred = $q.defer();

                var request = {
                    method: 'POST',
                    url: BASE_URL + 'projects',
                    data: projectData,
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + identityService.getUserAuth()
                    }
                };
                
                $http(request)
                    .then(function(success) {
                        deferred.resolve(success.data)
                    }, function(error) {
                        reject(error);
                    });
                
                return deferred.promise;
            }
            
            function getSuggestLabels(inputLabel) {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();
                
                $http.get(BASE_URL + 'labels/?filter=' + inputLabel, config)
                    .then(function(labels) {
                        deferred.resolve(labels.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                
                return deferred.promise;
            }
            
            function parseProjectToUrlEncoded(project) {
                
                var projectParseData = 'Name=' + project.Name + '&Description=' + project.Description + '&LeadId=' + project.LeadId + '&ProjectKey=' + project.ProjectKey; 
                
                project.labels = project.labels.split(', ');
                project.priorities = project.priorities.split(', ');
                
                var parseLabels = '';
                for(var key in project.labels) {
                    parseLabels += 'labels[' + key + '].Name=' + project.labels[key] + '&';
                }
                
                var parsePriorities = '';
                for(var key in project.priorities) {
                    parsePriorities += 'priorities[' + key + '].Name=' + project.priorities[key] + '&';
                }
                
                return parseLabels + parsePriorities + projectParseData;
            }
            
            return {
                getProject: getProject,
                getLeadId: getLeadId,
                getAllProjects: getAllProjects,
                getMyProjects: getMyProjects,
                addProject: addProject,
                getSuggestLabels: getSuggestLabels
            }
        }
    ]);