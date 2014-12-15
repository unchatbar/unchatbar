/**
 * @ngdoc controller
 * @name  unchatbar.controller:phoneBook
 * @require $scope
 * @require broker
 * @description
 *
 * show all client connections
 * #controller of this directive
 * #{@link unchatbar.clientCalled directive}
 *
 */
angular.module('unchatbar').controller('phoneBook', ['$scope','broker',
    function ($scope,broker) {
        /**
         * @ngdoc property
         * @name username
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} clientList map of all client connections
         */
        $scope.clientList = broker.getMapOfClientCalled();

     
        /**
         * @ngdoc methode
         * @name removeClient
         * @methodOf unchatbar.controller:phoneBook
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
         * @methodOf unchatbar.controller:phoneBook
         * @params  {String} peerId id of client
         * @description
         *
         * create connection to client
         *
         */
        $scope.connectClient = function (peerId) {
            broker.connectToClient(peerId);
        };

        $scope.$on('peer:clientConnect', function (event, data) {
            $scope.clientList = broker.getMapOfClientCalled();
        });

    }
]);