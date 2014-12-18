/**
 * @ngdoc controller
 * @name  unchatbar.controller:dialer
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
angular.module('unchatbar').controller('dialer', ['$scope', '$rootScope', 'Broker', 'DataConnection',
    function ($scope, $rootScope, Broker, DataConnection) {


        /**
         * @ngdoc property
         * @name peerId
         * @propertyOf unchatbar.controller:dialer
         * @returns {String} id from broker
         */
        $scope.peerId = Broker.getPeerId();

        /**
         * @ngdoc property
         * @name connectId
         * @propertyOf unchatbar.controller:dialer
         * @returns {String} client id for connect
         */
        $scope.connectId = '';


        /**
         * @ngdoc methode
         * @name connect
         * @methodOf unchatbar.controller:dialer
         * @description
         *
         * connect to client
         *
         */
        $scope.connect = function () {
            var connection = DataConnection.connect($scope.connectId);
            $scope.connectId = '';
        };

        $scope.$on('peer:open', function (event, message) {
            $scope.peerId = Broker.getPeerId();

        });

    }
]);