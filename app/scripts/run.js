'use strict';
/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar').run(['Broker','MessageText','PhoneBook','Profile','Connection','Stream',
    function (Broker,MessageText,PhoneBook,Profile,Connection,Stream) {
        MessageText.init();
        Stream.init();
        PhoneBook.init();
        Profile.init();
        Connection.init();
        Broker.connectServer();
    }
    ]);
