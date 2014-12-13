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
angular.module('webrtcApp').controller('connection', ['$scope', '$rootScope', 'notify',
    function ($scope, $rootScope, notify) {

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

        /**
         * @ngdoc methode
         * @name closeConnection
         * @methodOf webrtcApp.controller:clientMessageData
         * @description
         *
         * close connection to client
         *
         */
        $scope.closeConnection = function () {
            $scope.connect.close();
        }

        $scope.$on('clientConnection:open', function (event) {
            $scope.isOpen = true;
            notifyOpenConnection();
        });

        $scope.$on('clientConnection:close', function () {
            notify({
                message: 'Xconnect to ' + $scope.connect.peer + ' close',
                classes: 'alert alert-info',
                templateUrl: ''
            });
            $scope.$emit('peer:clientDisconnect', { connectionId: $scope.connectionIndex})
            $scope.isOpen = false;
        });

        // Receive messages
        $scope.$on('clientConnection:data', function (event, data) {
            $scope.messageList.push({own: false, text: data});

        });

        function notifyOpenConnection() {
            if ($scope.isOpen) {
                notify({
                    message: 'connect to ' + $scope.connect.peer + ' succesfull',
                    classes: 'alert alert-success',
                    templateUrl: ''
                });
            }
        }


        notifyOpenConnection();

    }
]);