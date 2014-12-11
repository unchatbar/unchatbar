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
angular.module('webrtcApp').controller('clientCalled', ['$scope',
    function ($scope) {
        /**
         * @ngdoc property
         * @name username
         * @propertyOf webrtcApp.controller:clientCalled
         * @returns {Object} clientList map of all client connections
         */
        $scope.clientList = {};

        $scope.$on('peer:clientConnect', function (event, data) {
            $scope.clientList[data.connectId] = {
                name: data.connectId
            };

        });

        $scope.$on('connection:close', function (event, data) {
            delete $scope.clientList[data.connectId];
        });

    }
]);