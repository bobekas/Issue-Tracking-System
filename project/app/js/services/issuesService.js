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
            
            function getCurrentIssue(issueId) {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();
                $http.get(BASE_URL + 'issues/' + issueId, config)
                    .then(function(issues) {
                        deferred.resolve(issues.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                
                return deferred.promise;
            }
            
            function getCurrentIssueComments(issueId) {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();
                $http.get(BASE_URL + 'issues/' + issueId + '/comments', config)
                    .then(function(issues) {
                        deferred.resolve(issues.data);
                    }, function(error) {
                        deferred.resolve(error);
                    });
                
                return deferred.promise;
            }
            
            function changeIssueStatus(issueId, statusId) {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();
                
                $http.put(BASE_URL + 'issues/' + issueId + '/changestatus?statusid=' + statusId, null, config)
                    .then(function(issues) {
                        deferred.resolve(issues.data);
                    }, function(error) {
                        deferred.resolve(error);
                    });
                
                return deferred.promise;
            }
            
            function addIssue(data) {
                var deferred = $q.defer();
                
                data = jQuery.param(data);
                
                var config = identityService.getAuthHeaderConfig();
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                $http.post(BASE_URL + 'issues', data, config)
                    .then(function(issues) {
                        deferred.resolve(issues.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                
                return deferred.promise;
            }
            
            function addCommentToIssue(issueId, data) {
                var deferred = $q.defer();
                
                var config = identityService.getAuthHeaderConfig();

                $http.post(BASE_URL + 'issues/' + issueId + '/comments', data, config)
                    .then(function(comments) {
                        deferred.resolve(comments.data);
                    }, function(error) {
                        deferred.reject(error);
                    });
                
                return deferred.promise;
            }
            
            return {
                getProjectIssues: getProjectIssues,
                addIssue: addIssue,
                getMyIssues: getMyIssues,
                getCurrentIssue: getCurrentIssue,
                getCurrentIssueComments: getCurrentIssueComments,
                changeIssueStatus: changeIssueStatus,
                addCommentToIssue: addCommentToIssue
            }
        }
    ]);