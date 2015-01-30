'use strict';
/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar').run(['$rootScope', '$state', 'Broker', 'MessageText', 'PhoneBook', 'Profile', 'Connection', 'Stream', 'Notify',
    function ($rootScope, $state, Broker, MessageText, PhoneBook, Profile, Connection, Stream, Notify) {
        MessageText.initStorage();
        Broker.initStorage();
        PhoneBook.initStorage();
        Profile.initStorage();

        Notify._getNotificationPermission();
        Notify._initMessageSound();
        Notify._initStreamSound();

        $rootScope.$on('ConnectionOpen', function (event, data) {
            Connection.send(data.peerId, {action: 'profile', profile: Profile.get()});
            MessageText.sendFromQueue(data.peerId);
        });

        $rootScope.$on('ConnectionGetMessagetextMessage', function (event, data) {
            Notify.textMessage('you have new messages');
            MessageText.addToInbox(data.message.groupId || data.peerId, data.peerId, data.message);
        });

        $rootScope.$on('ConnectionGetMessagereadMessage', function (event, data) {
            MessageText.removeFromQueue(data.peerId, data.message.id);
        });

        $rootScope.$on('ConnectionGetMessageupdateStreamGroup', function (event, data) {
            Stream.callToGroupUsersFromClient(data.peerId, data.message.users);
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
            Connection.add(data.connection);
            PhoneBook.addClient(data.connection.peer, {label: data.connection.peer});

        });

        $rootScope.$on('BrokerPeerCall', function (event, data) {
            Stream.addCallToAnswer(data.client);
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
        }
    }
]);
