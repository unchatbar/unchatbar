/**
 * @ngdoc controller
 * @name  webrtcApp.controller:clientCalled
 * @require $scope
 * @require broker
 * @description
 *
 * show all client connections
 * #controller of this directive
 * #{@link webrtcApp.clientCalled directive}
 *
 */
angular.module('webrtcApp').controller('phoneBook', ['$scope','broker',
    function ($scope,broker) {
        /**
         * @ngdoc property
         * @name username
         * @propertyOf webrtcApp.controller:clientCalled
         * @returns {Object} clientList map of all client connections
         */
        $scope.clientList = broker.getMapOfClientCalled();

        $scope.$on('peer:clientConnect', function (event, data) {
            $scope.clientList = broker.getMapOfClientCalled();
        });

        /**
         * @ngdoc methode
         * @name removeClient
         * @methodOf webrtcApp.controller:clientCalled
         * @params  {String} peerId id of client
         * @description
         *
         * remove client from phone book list
         *
         */
        $scope.removeClient = function (peerId) {
            if (broker.removeClientCalled(peerId)) {
                $scope.clientList = broker.getMapOfClientCalled();
            }
        };

        /**
         * @ngdoc methode
         * @name removeClient
         * @methodOf webrtcApp.controller:clientCalled
         * @params  {String} peerId id of client
         * @description
         *
         * create connection to client
         *
         */
        $scope.connectClient = function (peerId) {
            broker.connectToClient(peerId);
        };
    }
]);