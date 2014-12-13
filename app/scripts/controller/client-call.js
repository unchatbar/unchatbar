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
angular.module('webrtcApp').controller('clientCalled', ['$scope','broker',
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



    }
]);