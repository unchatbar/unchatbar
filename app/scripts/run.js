'use strict';
/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar').run(['$rootScope', '$state', 'Broker',
    function ($rootScope, $state, Broker) {
        if (!Broker.getPeerIdFromStorage()) {
            $state.go('login');
            $rootScope.$on('BrokerPeerOpen', function () {
                $state.go('contact');
            });
            return false;
        }

    }
]);
