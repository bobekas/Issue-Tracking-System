angular.module('issueTracker.issuesService', [])
    .factory('issuesService', [
        '$http',
        '$q',
        'BASE_URL',
        'identityService',
        function ($http, $q, BASE_URL, identityService) {
            function getProjectIssues(id, pageSize, pageNumber) {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();
                
                $http.get(BASE_URL + 'issues/?pageSize=' + pageSize + '&pageNumber=' + pageNumber + '&filter=ProjectId == ' + id, config)
                    .then(function(issues) {
                        deferred.resolve(issues.data);
                    }, function(error) {
                        deferred.resolve(error);
                    });
                
                return deferred.promise;
            }
            
            function getMyIssues(pageSize, pageNumber) {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();
                $http.get(BASE_URL + 'issues/me?orderBy=Project.Name desc, IssueKey&pageSize=' + pageSize + '&pageNumber=' + pageNumber, config)
                    .then(function(issues) {
                        deferred.resolve(issues.data);
                    }, function(error) {
                        deferred.resolve(error);
                    });
                
                return deferred.promise;
            }
            
            return {
                getProjectIssues: getProjectIssues,
                getMyIssues: getMyIssues
            }
        }
    ]);