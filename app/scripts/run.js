'use strict';
/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar').run(['$state','Broker','MessageText','PhoneBook','Profile','Connection','Stream','Notify',
    function ($state,Broker,MessageText,PhoneBook,Profile,Connection,Stream,Notify) {
        MessageText.init();
        Stream.init();
        PhoneBook.init();
        Profile.init();
        Connection.init();
        Broker._initStorage();
        Notify.init();
        if (!Broker.getPeerIdFromStorage()) {
            $state.go('login');
            return false;

        } else {
            Broker.connectServer();
            $state.go('chat');
        }
    }
    ]);
