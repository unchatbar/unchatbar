'use strict';
/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar').run(['$rootScope', '$state', 'Broker', 'PhoneBook', 'Notify',
    function ($rootScope, $state, Broker, PhoneBook, Notify) {
        PhoneBook.initStorage();

        Notify._getNotificationPermission();
        Notify._initMessageSound();
        Notify._initStreamSound();


        $rootScope.$on('ConnectionGetMessagetextMessage', function () {
            Notify.textMessage('you have new messages');
        });

        $rootScope.$on('ConnectionGetMessageprofile', function (event, data) {
            PhoneBook.updateClient(data.peerId, data.message.profile.label || '');
        });

        $rootScope.$on('ConnectionGetMessageupdateUserGroup', function (event, data) {
            PhoneBook.copyGroupFromPartner(data.message.group.id, data.message.group);
        });

        $rootScope.$on('ConnectionGetMessageremoveGroup', function (event, data) {
            PhoneBook.removeGroupByClient(data.peerId, data.message.roomId);
        });

        $rootScope.$on('BrokerPeerConnection', function (event, data) {
            PhoneBook.addClient(data.connection.peer, {label: data.connection.peer});

        });

        $rootScope.$on('BrokerPeerCall', function (event, data) {
            PhoneBook.addClient(data.client.peer, data.client.metadata.profile);
        });


        $rootScope.$on('BrokerPeerOpen', function () {
            _.forEach(PhoneBook.getClientMap(), function (item) {
                if (item.id) {
                    Broker.connect(item.id);
                }
            });
        });

        if (!Broker.getPeerIdFromStorage()) {
            $state.go('login');
            return false;
        } else {
            Broker.connectServer();
            $state.go('chat');
        }
    }
]);
