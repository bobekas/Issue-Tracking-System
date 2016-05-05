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
                    'issuesService',
                    function($route, issuesService) {
                        return issuesService.getCurrentIssue($route.current.params.issueId);
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
}])

.controller('CurrentIssueCtrl', [
    '$scope', 
    '$location',
    '$route',
    'notify',
    'getCurrentIssue',
    'getCurrentIssueComments',
    'issuesService',
    function($scope, $location, $route, notify, getCurrentIssue, getCurrentIssueComments, issuesService) {
        $scope.issueId = $route.current.params.issueId;
        if(getCurrentIssue['statusText'] === 'Bad Request') {
            notify({
                message: getCurrentIssue.data.Message,
                duration: 6000,
                classes: ['cg-notify-error']
            });
            $location.path('/dashboard');
        }
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
    }]);