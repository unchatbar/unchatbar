'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar.clientConnector
 * @param {autocall-from-phonebook} call all from phonebook automaticly
 * @restrict E
 * @description
 *
 * # activeConnection
 * dialog for client connection
 * # controller definition {@link unchatbar.controller:clientConnector controller}

 *
 */

angular.module('unchatbar').directive('dialer', ['$rootScope', 'DataConnection', 'PhoneBook',
    function (broker, $rootScope, DataConnection, PhoneBook) {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            templateUrl: 'views/peer/dialer.html',
            controller: 'dialer',
            scope: {
                autocallFromPhonebook: '='
            },
            link: function (scope, element, attr) {
                if (scope.autocallFromPhonebook === true) {
                    _.forEach(PhoneBook.getMap(), function (value, connectionId) {
                        DataConnection.connect(connectionId);
                    })
                }
            }

        };
    }
]);
