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
