'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:connectionCenter
 * @require $scope
 * @description
 *
 *  handle all connection
 *
 */
angular.module('unchatbar').controller('connectionCenter', ['$scope',
    function ($scope) {
        $scope.showPanel = 'dashboard';
        $scope.panelInfo = {};
        $scope.setView = function (viewName) {
            $scope.showPanel = $scope.showPanel === viewName ? '' : viewName;
            $scope.$broadcast('setView',{name:$scope.showPanel});
        };

        $scope.$on('panelInfo',function(event,data){
            console.log("GET IN CENTER");
            $scope.panelInfo[data.name] = data.info;
        });
    }]
);