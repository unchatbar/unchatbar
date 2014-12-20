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
        /**
         * @ngdoc property
         * @name connections
         * @propertyOf unchatbar.controller:connectionCenter
         * @returns {Object} map of client connections
         */
        $scope.connections = {};

        $scope.$on('client:connect', function (event, data) {
            $scope.connections[data.connection.peer] = data.connection;
        });

        $scope.$on('peer:clientDisconnect',function(event,data){
            delete $scope.connections[data.connectionId];
        });
    }]
);