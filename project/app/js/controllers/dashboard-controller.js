'use strict';

angular.module('issueTracker.home.dashboard', [
    'issueTracker.issuesService'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'app/templates/dashboard.html',
        controller: 'DashboardCtrl',
        resolve: {
            getFirstIssues: [
                'issuesService',
                function(issuesService) {
                    return issuesService.getMyIssues(5, 1);
                }
            ],
            getFirstProjects: [
                'projectsService',
                function(projectsService) {
                    return projectsService.getMyProjects(5, 1);
                }
            ]
        }
        
    });
}])

.controller('DashboardCtrl', [
    '$scope',
    'issuesService',
    'projectsService',
    'getFirstIssues',
    'getFirstProjects',
    function($scope, issuesService, projectsService, getFirstIssues, getFirstProjects) {
        $scope.issues = getFirstIssues.Issues;
        $scope.issuePages = getFirstIssues.TotalPages;
        $scope.projects = getFirstProjects.Projects;
        $scope.projectsPages = getFirstProjects.TotalPages;
        $scope.changeIssuePage = function(page) {
            issuesService.getMyIssues(5, page)
                .then(function(data) {
                        $scope.issues = data.Issues;
                    });
        }
        $scope.changeProjectPage = function(page) {
            projectsService.getMyProjects(5, page)
                .then(function(data) {
                    $scope.projects = data.Projects;
                });
        }
    }
]);