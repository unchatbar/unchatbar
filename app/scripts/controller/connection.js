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
        $scope.isOpen = false;


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
            $scope.messageList = Connection.getMessageList();
            $scope.message = '';
        };

        // Receive messages
        $scope.$on('getMessage', function (event, data) {
            if ( $scope.isOpen) {
                $scope.messageList = Connection.getMessageList();
            }
        });


        $scope.$on('roomSelected', function (event, data) {
            $scope.showSendButton = true;
            $scope.messageList = Connection.getMessageList();
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

        $scope.$on('setView',function(event,data){
            $scope.isOpen = data.name === 'chat' ? true : false;
        });
        $scope.$on('selectGroup',function(event,data){
            $scope.$emit('panelInfo',{
                    name:'chat',
                    info:data.name }
            );
        });
        $scope.$on('selectUser',function(event,data){
            $scope.$emit('panelInfo',{
                    name:'chat',
                    info:data.name }
            );
        });
        notifyOpenConnection();
    }
]);