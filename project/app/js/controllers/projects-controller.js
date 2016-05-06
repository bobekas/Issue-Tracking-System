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
                            }, function name(params) {
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
                getCurrentProject: [
                    '$route', 
                    '$location',
                    'projectsService',
                    function($route, $location, projectsService) {
                        projectsService.getProject($route.current.params.projectId)
                            .then(function(data) {
                            }, function(error) {
                                $location.path('/dashboard');
                            }); 
                        return projectsService.getProject($route.current.params.projectId);
                    }        
                ]
                ,
                getProjectIssues: [
                    '$route',
                    'issuesService',
                    function($route, issuesService) {
                        return issuesService.getProjectIssues($route.current.params.projectId, 5, 1);
                    }
                ]
            }
        })
}])

.controller('AddProjectCtrl', [
    '$scope', 
    '$location',
    'notify',
    'getAllUsers',
    'projectsService',
    function($scope, $location, notify, getAllUsers, projectsService) {
        
        $scope.users = getAllUsers;
        
        $scope.getSuggestLabels = function(labelInput) {
            projectsService.getSuggestLabels(labelInput)
                .then(function(suggestLabels) {
                    $scope.labels = suggestLabels;
                })
        }
        
        $scope.addProject = function(project) {
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
    function($scope, $location, $route, notify, getCurrentProject, getProjectIssues, issuesService) {
        $scope.project = getCurrentProject;
        $scope.issues = getProjectIssues.Issues;
        $scope.issuePages = getProjectIssues.TotalPages;
        $scope.changeIssuePage = function(page) {
            issuesService.getProjectIssues($route.current.params.projectId, 5, page)
                .then(function(data) {
                        $scope.issues = data.Issues;
                    });
        }
    }]);