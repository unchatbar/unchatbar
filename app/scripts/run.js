'use strict';
/**
 * @ngdoc overview
 * @name unchatbar
 * @description
 * # unchatbar
 *
 * Main module of the application.
 */
angular.module('unchatbar').run(['$rootScope','$window', '$state', 'Broker',
    function ($rootScope,$window, $state, Broker) {
        if (!Broker.getPeerIdFromStorage()) {
            $state.go('login');
            $rootScope.$on('BrokerPeerOpen', function () {
                $state.go('contact');
            });
            return false;
        } else {
            Broker.connectServer();
        }
        $window.addEventListener('online',  function(){
            if (Broker.getPeerIdFromStorage()) {
                Broker.connectServer();
            }
        });

    }
]);
