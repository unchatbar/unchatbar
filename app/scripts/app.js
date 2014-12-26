'use strict';

/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar', ['constants','cgNotify','ngStorage','ui.bootstrap','angularjs-dropdown-multiselect'])
    .run(['Broker','MessageText','PhoneBook','Profile','Connection', function (Broker,MessageText,PhoneBook,Profile,Connection) {
        MessageText.init();
        PhoneBook.init();
        Profile.init();
        Connection.init();
        Broker.connectServer();
    }
    ]);
