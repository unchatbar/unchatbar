'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:unChat
 * @require $scope
 * @require $stateParams
 * @require PhoneBook
 * @description
 *
 * client controller
 *
 */
angular.module('unchatbar').controller('unChat', ['$scope', '$stateParams', 'Broker', 'PhoneBook',
    function ($scope, $stateParams, Broker, PhoneBook) {

        /**
         * @ngdoc property
         * @name clientMap
         * @propertyOf unchatbar.controller:unChat
         * @returns {String} name of channel
         */
        $scope.channel = '';

        /**
         * @ngdoc property
         * @name clientFromChannelMap
         * @propertyOf unchatbar.controller:unChat
         * @returns {Array} list of clients
         */
        $scope.clientFromChannelMap = '';

        /**
         * @ngdoc property
         * @name clientMap
         * @propertyOf unchatbar.controller:unChat
         * @returns {Object} client map from phone-book
         */
        $scope.clientMap = '';

        /**
         * @ngdoc methode
         * @name getClientAllClients
         * @methodOf unchatbar.controller:unChat
         * @params  {String} peerId id of client
         * @description
         * *
         * get all clients from phone book
         *
         */

        $scope.getClientAllClients = function () {
            $scope.clientMap = PhoneBook.getClientMap();

        };

        /**
         * @ngdoc methode
         * @name getClientsFromChannel
         * @methodOf unchatbar.controller:unChat
         * @description
         * *
         * get user map from channel
         *
         */

        $scope.getClientsFromChannel = function () {
            if ($stateParams.groupId) {
                $scope.clientFromChannelMap = PhoneBook.getGroup($stateParams.groupId).users;
            } else if ($stateParams.clientId) {
                $scope.clientFromChannelMap = PhoneBook.getClient($stateParams.clientId);
            }
        };

        /**
         * @ngdoc methode
         * @name getChannel
         * @methodOf unchatbar.controller:unChat
         * @description
         *
         * get channel from phone-book
         *
         */
        $scope.getChannel = function () {
            var clientMap, clientList;
            if ($stateParams.groupId) {
                $scope.channel = $stateParams.groupId;
            } else if ($stateParams.clientId) {
                clientList = [
                    {'peerId': Broker.getPeerId()},
                    {'peerId': $stateParams.clientId}
                ];

                clientMap = _.pluck(_.sortBy(clientList, 'peerId'), 'peerId');
                $scope.channel = clientMap.toString().replace(',', '');

            }
        };

        /**
         * @ngdoc methode
         * @name init
         * @methodOf unchatbar.controller:unChat
         * @description
         *
         * init controller
         *
         */
        $scope.init = function(){
            $scope.getChannel();
            $scope.getClientsFromChannel();
            $scope.getClientAllClients();
        };

        $scope.$on('PhoneBookUpdate', function () {
            $scope.init();
        });

        $scope.$on('$stateChangeSuccess', function () {
            $scope.init();
        });

    }
]);