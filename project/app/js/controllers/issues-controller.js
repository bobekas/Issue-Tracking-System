'use strict';

angular.module('issueTracker.issues', [
    'issueTracker.issuesService'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/issues/:issueId', {
            templateUrl: 'app/templates/issue-page.html',
            controller: 'CurrentIssueCtrl',
            resolve: {
                getCurrentIssue: [
                    '$route',
                    '$location',
                    'issuesService',
                    function($route, $location, issuesService) {
                        issuesService.getCurrentIssue($route.current.params.issueId)
                            .then(function(data) {
                                
                            }, function(error) {
                                $location.path('/dashboard');
                            });
                        return issuesService.getCurrentIssue($route.current.params.issueId)
                    }
                ],
                getCurrentIssueComments: [
                    '$route',
                    'issuesService',
                    function($route, issuesService) {
                        return issuesService.getCurrentIssueComments($route.current.params.issueId);
                    }
                ]
            }
        })
        
        .when('/projects/:projectId/add-issue', {
            templateUrl: 'app/templates/add-issue.html',
            controller: 'AddIssueCtrl',
            resolve: {
                getCurrentProject: [
                    '$route',
                    '$location',
                    '$q',
                    'projectsService',
                    'identityService',
                    function($route, $location, $q, projectsService, identityService) {
                        var deferred = $q.defer();
                        
                        projectsService.getProject($route.current.params.projectId)
                            .then(function(project) {
                                identityService.isAdmin()
                                    .then(function(success) {
                                        deferred.resolve(project);
                                    }, function(error) {
                                        if(identityService.getUserId() === project.Lead.Id) {
                                            deferred.resolve(project);
                                        } else {
                                            $location.path('/dashboard');    
                                        }
                                    });
                            }, function(error) {
                                $location.path('/dashboard');
                            });
                        
                        return deferred.promise;
                    }
                ],
                getAllUsers: ['usersService', function(usersService) {
                    return usersService.getAllUsers();
                }]
            }
        })
        
        .when('/issues/:issueId/edit', {
            templateUrl: 'app/templates/edit-issue.html',
            controller: 'EditIssueCtrl',
            resolve: {
                getCurrentIssueData: [
                    '$route',
                    '$location',
                    '$q',
                    'projectsService',
                    'issuesService',
                    'identityService',
                    function($route, $location, $q, projectsService, issuesService, identityService) {
                        var deferred = $q.defer();
                        var data = {};
                        issuesService.getCurrentIssue($route.current.params.issueId)
                            .then(function(issue) {
                                data.issue = issue;
                                projectsService.getProject(issue.Project.Id)
                                            .then(function(project) {
                                                data.project = project;
                                                if(identityService.getUserId() === project.Lead.Id) {
                                                    deferred.resolve(data);
                                                } else {
                                                    identityService.isAdmin()
                                                        .then(function(success) {
                                                            deferred.resolve(data);
                                                        }, function(error) {
                                                            $location.path('/dashboard');  
                                                        });  
                                                }
                                            }, function(error) {
                                                $location.path('/dashboard');
                                            });
                            }, function(error) {
                                $location.path('/dashboard');
                            });
                        
                        return deferred.promise;
                    }
                ],
                getAllUsers: ['usersService', function(usersService) {
                    return usersService.getAllUsers();
                }]
            }
        });
}])

.controller('CurrentIssueCtrl', [
    '$scope', 
    '$location',
    '$route',
    'notify',
    'getCurrentIssue',
    'getCurrentIssueComments',
    'issuesService',
    'identityService',
    'projectsService',
    function($scope, $location, $route, notify, getCurrentIssue, getCurrentIssueComments, issuesService, identityService, projectsService) {
        $scope.issueId = $route.current.params.issueId;
        if(getCurrentIssue.Assignee.Id === identityService.getUserId()) {
            $scope.isAssignee = true;
        }
        projectsService.getLeadId(getCurrentIssue.Project.Id)
            .then(function(leadId) {
                if(leadId === identityService.getUserId()) {
                    $scope.isLeader = true;
                }
            });
        $scope.issue = getCurrentIssue;
        $scope.comments = getCurrentIssueComments;
        $scope.changeIssueStatus = function(id) {
            issuesService.changeIssueStatus($scope.issueId, id)
                .then(function(newStatus) {
                    issuesService.getCurrentIssue($scope.issueId)
                        .then(function(issue) {
                            $scope.issue = issue;
                        });
                });
        }
        $scope.addCommentToIssue = function (comment) {
            issuesService.addCommentToIssue($scope.issueId, comment)
                .then(function(comments) {
                    notify({
                        message: 'Your comment has been submitted.',
                        duration: 8000,
                        classes: ['alert-success']
                    });
                    $scope.comment = null;
                    $scope.addComment.$setPristine();
                    $scope.comments = comments;
                }, function(error) {
                    notify({
                        message: error.data.Message,
                        duration: 6000,
                        classes: ['cg-notify-error']
                    });
                });
        }
    }])
    
    .controller('AddIssueCtrl', [
        '$scope',
        'getCurrentProject',
        'getAllUsers',
        'notify',
        '$location',
        'issuesService',
        'usersService',
        function($scope, getCurrentProject, getAllUsers, notify, $location, issuesService, usersService) {
            var names = getAllUsers.map(function(user) {
                return user['Username'];
            });
            jQuery(function() {
                $( "#assignee" ).autocomplete({
                source: function(request, response) {
                    var results = $.ui.autocomplete.filter(names, request.term);
                    
                    response(results.slice(0, 5));
                }
                });
            });
            $scope.issue = {
                ProjectId: getCurrentProject.Id
            }
            $scope.project = {
                Name: getCurrentProject.Name,
                Priorities: getCurrentProject.Priorities
            }
            $scope.addIssue = function(issue) {
                usersService.getUserId(jQuery("#assignee").val())
                .then(function(userId) {
                    $scope.issue.AssigneeId = userId;
                    issuesService.addIssue(issue)
                        .then(function(issue) {
                            notify({
                            message: 'Issue has been added.',
                            duration: 4000,
                            classes: ['alert-success']
                        });
                        $location.path('/issues/' + issue.Id);
                        }, function(error) {
                            notify({
                                message: error.data.Message,
                                duration: 6000,
                                classes: ['cg-notify-error']
                            });
                        });
                });
            }
        }
    ])
    
.controller('EditIssueCtrl', [
    '$scope',
    'getCurrentIssueData',
    'getAllUsers',
    'notify',
    '$location',
    'issuesService',
    'usersService',
    function($scope, getCurrentIssueData, getAllUsers, notify, $location, issuesService, usersService) {  
        var names = getAllUsers.map(function(user) {
                return user['Username'];
            });
        var usersId
        jQuery(function() {
            $( "#assignee" ).autocomplete({
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(names, request.term);
                
                response(results.slice(0, 5));
            }
            });
        });
        $scope.issue = getCurrentIssueData.issue;
        $scope.project = getCurrentIssueData.project;
        $scope.edit = function(issue) {
            usersService.getUserId(jQuery("#assignee").val())
                .then(function(userId) {
                    $scope.issue.Assignee.Id = userId;
                    var data = 
                        'Title=' + issue.Title + 
                        '&Description=' + issue.Description + 
                        '&DueDate=' + issue.DueDate +
                        '&AssigneeId=' + issue.Assignee.Id +
                        '&PriorityId=' + issue.Priority.Id;
                    issuesService.editIssue(data, issue.Id)
                        .then(function(success) {
                            notify({
                                message: 'Issue has been edited.',
                                duration: 4000,
                                classes: ['alert-success']
                            });
                            $location.path('/issues/' + issue.Id);
                        }, function(error) {
                            notify({
                                    message: error.data.Message,
                                    duration: 6000,
                                    classes: ['cg-notify-error']
                                });
                        });
                });
        }
    }
]);