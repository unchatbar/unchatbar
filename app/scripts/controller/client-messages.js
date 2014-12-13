/**
 * @ngdoc controller
 * @name  webrtcApp.controller:clientMessages
 * @require $scope
 * @require $rootScope
 * @require broker
 * @description
 *
 *  Test Message Dialog
 * #controller of this directive
 * #{@link webrtcApp.clientMessages directive}
 *
 */
angular.module('webrtcApp').controller('clientMessages', ['$scope','broker',
    function ($scope,broker) {
        /**
         * @ngdoc property
         * @name connections
         * @propertyOf webrtcApp.controller:clientMessages
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