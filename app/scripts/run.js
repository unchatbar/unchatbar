'use strict';
/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar').run(['Broker','MessageText','PhoneBook','Profile','Connection', function (Broker,MessageText,PhoneBook,Profile,Connection) {
        MessageText.init();
        PhoneBook.init();
        Profile.init();
        Connection.init();
        Broker.connectServer();
    }
    ]);
