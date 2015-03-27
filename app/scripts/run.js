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
            var isLogin = toState.name === 'login';
            if(isLogin){
                return;
            }
            if (!Broker.getPeerIdFromStorage()) {
                e.preventDefault();
                $state.go('login');
                $rootScope.$on('BrokerPeerOpen', function () {
                    $state.go('contact');
                });
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
