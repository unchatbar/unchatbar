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
angular.module('webrtcApp').controller('clientMessages', ['$scope',
    function ($scope) {
        /**
         * @ngdoc property
         * @name connections
         * @propertyOf webrtcApp.controller:clientMessages
         * @returns {Object} map of client connections
         */
        $scope.connections = {};

        $scope.$on('peer:clientConnect',function(event,data){
            $scope.connections[data.connectId] = (data.connection);
        });

        $scope.$on('peer:clientDisconnect',function(event,data){
            delete $scope.connections[data.connectId];
        });
    }]
);