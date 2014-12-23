'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:phoneBook
 * @require $scope
 * @require $localStorage
 * @require Broker
 * @description
 *
 * save client connections , for recall
 *
 */

//TODO add groups config local Storage
angular.module('unchatbar').controller('phoneBook', ['$scope','$rootScope','$sessionStorage','Broker','Connection',
    function ($scope,$rootScope,$localStorage, Broker, Connection) {
        var storagePhoneBook = $localStorage.$default({
            phoneBook: {
                connections: {},
                groups: {}
            }
        }).phoneBook;


        /**
         * @ngdoc property
         * @name username
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} clientList map of all client connections
         */
        $scope.clientList = storagePhoneBook.connections;
        $scope.groupList = storagePhoneBook.groups;
        $scope.label = '';
        $scope.selection = {
            type:'',
            data: ''
        };
        /**
         * @ngdoc methode
         * @name removeClient
         * @methodOf unchatbar.controller:phoneBook
         * @params  {String} peerId id of client
         * @description
         *
         * remove client from phone book list
         *
         */
        $scope.removeClient = function (peerId) {
            delete $scope.clientList[peerId];
        };

        $scope.createGroup = function () {
            if(Broker.getPeerId()) {
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var id = '';
                for (var i = 0; i < 5; i++) {
                    id += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                $scope.groupList[id] = {
                    label: $scope.label,
                    users: [],
                    owner: Broker.getPeerId()
                };
                $scope.label = '';
            }
        };

        /**
         * @ngdoc methode
         * @name removeClient
         * @methodOf unchatbar.controller:phoneBook
         * @params  {String} peerId id of client
         * @description
         *
         * create connection to client
         *
         */
        $scope.$on('peer:open', function () {
            $scope.init();
        });
        $scope.init = function () {
            _.forEach($scope.clientList, function (item, peer) {
                if(item.id) {
                    Broker.connect(item.id);
                }
            });
            $scope.showList = false;
        };

        $scope.selectClient = function (peerId) {
            $scope.selection = {
                type: 'user',
                data: $scope.clientList[peerId]
            };
            Connection.setClient( $scope.selection);
            $scope.showList = false;
        };

        $scope.selectRoom = function (roomId) {
            $scope.selection = {
                type: 'group',
                data: $scope.groupList[roomId]
            };
            Connection.setClient( $scope.selection);
            $scope.showList = false;
        };

        $scope.removeRoom = function (roomId) {
            delete $scope.groupList[roomId];
        };


        $scope.$on('client:connect', function (event, data) {
            Connection.add(data.connection);
            if(!$scope.clientList[data.connection.peer]) {
                $scope.clientList[data.connection.peer] = {
                    label:data.connection.peer,
                    id: data.connection.peer
                };
            }
        });

        $scope.$on('client:sendProfile', function (event, data) {
            if($scope.clientList[data.peer]) {
                $scope.clientList[data.peer] = {
                    label:data.profile.label || data.peer,
                    id: data.peer
                };

            }
        });
    }
]);