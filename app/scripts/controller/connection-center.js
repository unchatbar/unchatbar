/**
 * @ngdoc controller
 * @name  unchatbar.controller:clientMessages
 * @require $scope
 * @require $rootScope
 * @require broker
 * @description
 *
 *  Test Message Dialog
 * #controller of this directive
 * #{@link unchatbar.clientMessages directive}
 *
 */
angular.module('unchatbar').controller('connectionCenter', ['$scope','broker',
    function ($scope,broker) {
        /**
         * @ngdoc property
         * @name connections
         * @propertyOf unchatbar.controller:clientMessages
         * @returns {Object} map of client connections
         */
        $scope.connections = broker.getMapOfActiveClients();


        $scope.$on('peer:clientConnect',function(event,data){
            $scope.connections = broker.getMapOfActiveClients();
        });

        $scope.$on('peer:clientDisconnect',function(event,data){
            $scope.connections = broker.removeClientFromCalledMap(data.connectionId);
            $scope.connections = broker.getMapOfActiveClients();
        });
    }]
);