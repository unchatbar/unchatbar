/**
 * @ngdoc controller
 * @name  unchatbar.controller:clientConnector
 * @require $scope
 * @require $rootScope
 * @require broker
 * @description
 *
 * connect to client dialog
 * #controller of this directive
 * #{@link unchatbar.clientConnector directive}
 *
 */
angular.module('unchatbar').controller('dialer', ['$scope', '$rootScope', 'broker',
    function ($scope, $rootScope, broker) {


        /**
         * @ngdoc property
         * @name peerId
         * @propertyOf unchatbar.controller:clientConnector
         * @returns {String} id from broker
         */
        $scope.peerId = broker.getPeerId();

        /**
         * @ngdoc property
         * @name connectId
         * @propertyOf unchatbar.controller:clientConnector
         * @returns {String} client id for connect
         */
        $scope.connectId = '';


        /**
         * @ngdoc methode
         * @name connect
         * @methodOf unchatbar.controller:clientConnector
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
                $scope.peerId = broker.getPeerId();
            });
        });

    }
]);