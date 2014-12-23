'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:connection
 * @require $scope
 * @require $rootScope
 * @require notify
 * @description
 *
 * single client connection
 *
 */
angular.module('unchatbar').controller('connection', ['$scope', '$rootScope', 'notify','Connection',
    function ($scope, $rootScope, notify,Connection) {

        /**
         * @ngdoc property
         * @name isOpen
         * @propertyOf unchatbar.controller:connection
         * @returns {Boolean} is connection open
         */
        $scope.isOpen = $scope.connect.open ? true : false;

        $scope.showSendButton = false;
        /**
         * @ngdoc property
         * @name message
         * @propertyOf unchatbar.controller:connection
         * @returns {String} user message text
         */
        $scope.message = '';

        /**
         * @ngdoc property
         * @name message
         * @propertyOf unchatbar.controller:connection
         * @returns {Array} list of all messages
         */
        $scope.messageList = [];

        /**
         * @ngdoc property
         * @name minimize
         * @propertyOf unchatbar.controller:connection
         * @returns {Boolean} is view minimze
         */
        $scope.minimize = false;

        /**
         * @ngdoc property
         * @name unreadMessageCounter
         * @propertyOf unchatbar.controller:connection
         * @returns {Number} number of unread messages
         */
        $scope.unreadMessageCounter = 0;

        /**
         * @ngdoc methode
         * @name send
         * @methodOf unchatbar.controller:connection
         * @description
         *
         * send message to client
         *
         */
        $scope.send = function () {
            Connection.send($scope.message);
            $scope.messageList.push({own: true, text: $scope.message,label:''});
            $scope.message = '';
        };

        // Receive messages
        $scope.$on('getMessage', function (event, data) {
            $scope.messageList.push({own: false, text: data.message,label: data.label});
        });


        $scope.$on('roomSelected', function (event, data) {
            $scope.showSendButton = true;
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
        $scope.init = function (){
            Connection.register($scope);
        };
        notifyOpenConnection();
    }
]);