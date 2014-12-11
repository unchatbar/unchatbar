/**
 * @ngdoc controller
 * @name  webrtcApp.controller:clientMessageData
 * @require $scope
 * @require $rootScope
 * @require broker
 * @description
 *
 *  Test Message Dialog
 * #controller of this directive
 * #{@link webrtcApp.clientMessageData directive}
 *
 */
angular.module('webrtcApp').controller('clientMessageData', ['$scope', '$rootScope',
    function ($scope, $rootScope) {

        /**
         * @ngdoc property
         * @name isOpen
         * @propertyOf webrtcApp.controller:clientMessageData
         * @returns {Boolean} is connection open
         */
        $scope.isOpen = $scope.connect.open ? true : false;

        /**
         * @ngdoc property
         * @name message
         * @propertyOf webrtcApp.controller:clientMessageData
         * @returns {String} user message text
         */
        $scope.message = '';

        /**
         * @ngdoc property
         * @name message
         * @propertyOf webrtcApp.controller:clientMessageData
         * @returns {Array} list of all messages
         */
        $scope.messageList = [];

        /**
         * @ngdoc methode
         * @name send
         * @methodOf webrtcApp.controller:clientMessageData
         * @description
         *
         * send message to client
         *
         */

        $scope.send = function () {
            $scope.connect.send($scope.message);
            $scope.messageList.push({own: true, text: $scope.message});
            $scope.message = '';
        };

        $scope.$on('clientConnection:open', function (event) {
            $scope.isOpen = true;
        });

        $scope.$on('clientConnection:close', function () {
            $scope.$emit('peer:clientDisconnect', {connectionIndex: $scope.connectionIndex})
            $scope.isOpen = false;
        });

        // Receive messages
        $scope.$on('clientConnection:data', function (event,data) {
            $scope.messageList.push({own: false, text: data});

        });

    }
]);