'use strict';
/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar').run(['$rootScope', '$window', '$state', 'Broker',
    function ($rootScope, $window, $state, Broker) {
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            if (Broker.getPeerIdFromStorage() && toState.name === 'login') {
                e.preventDefault();
                $state.go('index');
            }else if (!Broker.getPeerIdFromStorage() && toState.name !== 'login') {
                e.preventDefault();
                $state.go('login');
            }
        });
        $rootScope.$on('BrokerPeerOpen', function () {
            if ($state.current.name === 'login') {
                $state.go('contact');
            }
        });
        if (Broker.getPeerIdFromStorage()) {
            Broker.connectServer();
        }
        $window.addEventListener('online', function () {
            if (Broker.getPeerIdFromStorage()) {
                Broker.connectServer();
            }
        });

    }
]);
