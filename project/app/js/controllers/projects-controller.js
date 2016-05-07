'use strict';

angular.module('issueTracker.projects', [
    'issueTracker.projectsService',
    'issueTracker.issuesService'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/projects/add', {
            templateUrl: 'app/templates/add-project.html',
            controller: 'AddProjectCtrl',
            resolve: {
                isAdmin: [
                    '$location',
                    'identityService',
                    function($location, identityService) {
                        identityService.isAdmin()
                            .then(function(data) {
                                return data;
                            }, function name(params) {
                                $location.path('/dashboard');
                            })
                    }
                ],
                getAllUsers: ['usersService', function(usersService) {
                    return usersService.getAllUsers();
                }]
            }
        })
        .when('/projects', {
            templateUrl: 'app/templates/projects.html',
            controller: 'GetAllProjectsCtrl',
            resolve: {
                isAdmin: [
                    '$location',
                    'identityService',
                    function($location, identityService) {
                        identityService.isAdmin()
                            .then(function(data) {
                                return data;
                            }, function() {
                                $location.path('/dashboard');
                            })
                    }
                ],
                getAllProjects: ['projectsService', function(projectsService) {
                    return projectsService.getAllProjects();
                }]
            }
        })
        .when('/projects/:projectId', {
            templateUrl: 'app/templates/project-page.html',
            controller: 'CurrentProjectCtrl',
            resolve: {
                isLeader: [
                    '$q',
                    'projectsService',
                    '$route',
                    'identityService',
                    function($q, projectsService, $route, identityService) {
                        var deferred = $q.defer();
                        
                        projectsService.getLeadId($route.current.params.projectId)
                            .then(function(leadId) {
                                if(leadId === identityService.getUserId()) {
                                    deferred.resolve(true);
                                } else {
                                    deferred.resolve(false);
                                }
                            });
                            
                        return deferred.promise;
                    }
                ],
                getCurrentProject: [
                    '$q',
                    '$route', 
                    '$location',
                    'projectsService',
                    function($q, $route, $location, projectsService) {
                        var deferred = $q.defer();
                        
                        projectsService.getProject($route.current.params.projectId)
                            .then(function(data) {
                                deferred.resolve(data);
                            }, function(error) {
                                $location.path('/dashboard');
                            }); 
                        return deferred.promise;
                    }        
                ],
                getProjectIssues: [
                    '$route',
                    'issuesService',
                    function($route, issuesService) {
                        return issuesService.getProjectIssues($route.current.params.projectId, 5, 1);
                    }
                ]
            }
        })
        
        .when('/projects/:projectId/edit', {
            templateUrl: 'app/templates/edit-project.html',
            controller: 'EditProjectCtrl',
            resolve: {
                isAdmin: [
                    '$q',
                    'identityService',
                    'projectsService',
                    '$route',
                    '$location',
                    function($q, identityService, projectsService, $route, $location) {
                        var deferred = $q.defer();

                        identityService.isAdmin()
                            .then(function(success) {
                                deferred.resolve(true);
                            }, function(error) {
                                projectsService.getLeadId($route.current.params.projectId)
                                    .then(function(leadId) {
                                        if(leadId === identityService.getUserId()) {
                                            deferred.resolve(false);
                                        } else {
                                            $location.path('/dashboard');
                                        }
                                    });
                            });
                            
                        return deferred.promise;
                    }
                ],
                getCurrentProject: [
                    '$q',
                    '$route', 
                    '$location',
                    'projectsService',
                    function($q, $route, $location, projectsService) {
                        var deferred = $q.defer();
                        
                        projectsService.getProject($route.current.params.projectId)
                            .then(function(data) {
                                deferred.resolve(data);
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
}])

.controller('AddProjectCtrl', [
    '$scope', 
    '$location',
    'notify',
    'getAllUsers',
    'projectsService',
    'usersService',
    function($scope, $location, notify, getAllUsers, projectsService, usersService) {
        var names = getAllUsers.map(function(user) {
            return user['Username'];
        });
        jQuery(function() {
            $( "#leader" ).autocomplete({
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(names, request.term);
                
                response(results.slice(0, 5));
            }
            });
        });
        
        $scope.addProject = function(project) {
            usersService.getUserId(jQuery("#leader").val())
                .then(function(userId) {
                    $scope.project.LeadId = userId;
                    projectsService.addProject(project)
                        .then(function(project) {
                            notify({
                                message: 'Successful!',
                                duration: 4000,
                                classes: ['alert-success']
                            });
                            $location.path('/projects/' + project.Id);
                        }, function(error) {
                            notify({
                                    message: 'Bad request!',
                                    duration: 8000,
                                    classes: ['cg-notify-error']
                                });
                        });    
                });
        }
    }])
    
.controller('GetAllProjectsCtrl', [
    '$scope',
    'getAllProjects',
    function($scope, getAllProjects) {
        $scope.projects = getAllProjects;
    }])
    
.controller('CurrentProjectCtrl', [
    '$scope', 
    '$location',
    '$route',
    'notify',
    'getCurrentProject',
    'getProjectIssues',
    'issuesService',
    'isLeader',
    function($scope, $location, $route, notify, getCurrentProject, getProjectIssues, issuesService, isLeader) {
        $scope.isLeader = isLeader;
        $scope.project = getCurrentProject;
        $scope.issues = getProjectIssues.Issues;
        $scope.issuePages = getProjectIssues.TotalPages;
        $scope.changeIssuePage = function(page) {
            issuesService.getProjectIssues($route.current.params.projectId, 5, page)
                .then(function(data) {
                        $scope.issues = data.Issues;
                    });
        }
    }])
    
.controller('EditProjectCtrl', [
    '$scope',
    'notify',
    'projectsService',
    'isAdmin',
    'getCurrentProject',
    'getAllUsers',
    'usersService',
    function($scope, notify, projectsService, isAdmin, getCurrentProject, getAllUsers, usersService) {
        var names = getAllUsers.map(function(user) {
            return user['Username'];
        });
        jQuery(function() {
            $( "#leader2" ).autocomplete({
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(names, request.term);
                
                response(results.slice(0, 5));
            }
            });
        });
        
        $scope.isAdmin = isAdmin;
        $scope.project = getCurrentProject;
        $scope.project.Priorities = $scope.project.Priorities.map(function(priority) {
            return priority['Name'];    
        });
        $scope.project.Labels = $scope.project.Labels.map(function(label) {
            return label['Name'];    
        });
        $scope.updateProject = function(data) {
            usersService.getUserId(jQuery("#leader2").val())
                .then(function(userId) {
                    $scope.project.LeadId = userId;
                    projectsService.editProject(data)
                        .then(function(project) {
                            notify({
                                message: 'Successful!',
                                duration: 4000,
                                classes: ['alert-success']
                            });
                        }, function(error) {
                            notify({
                                    message: 'Bad request!',
                                    duration: 8000,
                                    classes: ['cg-notify-error']
                                });
                        });    
                });
        }
    }
])