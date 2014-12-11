/**
 * @ngdoc controller
 * @name  webrtcApp.controller:clientConnector
 * @require $scope
 * @require $rootScope
 * @require broker
 * @description
 *
 * connect to client dialog
 * #controller of this directive
 * #{@link webrtcApp.clientConnector directive}
 *
 */
angular.module('webrtcApp').controller('clientConnector', ['$scope', '$rootScope', 'broker',
    function ($scope, $rootScope, broker) {

        /**
         * @ngdoc property
         * @name peerId
         * @propertyOf webrtcApp.controller:clientConnector
         * @returns {Boolean} is connect to broker
         */
        $scope.peerId = broker.getPeerId();

        /**
         * @ngdoc methode
         * @name connect
         * @methodOf webrtcApp.controller:clientConnector
         * @description
         *
         * connect to client
         *
         */
        $scope.connect = function () {
            var connection = broker.connectToClient($scope.connectId);
            $scope.connectId = '';
        };

        $scope.$on('peer:open', function (event, message) {
            $rootScope.$apply(function () {
                $scope.peerId = broker.get().id;
            });
        });

    }
]);