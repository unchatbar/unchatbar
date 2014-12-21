'use strict';

angular.module('unchatbar')
    .config(['BrokerProvider', 'LOCALSTORAGE', function (BrokerProvider,ProfileProvider, LOCALSTORAGE) {
        if (LOCALSTORAGE === true) {
            BrokerProvider.setLocalStorage();
            ProfileProvider.setLocalStorage();

        }
        BrokerProvider.setHost('unchatbar-server.herokuapp.com');
        BrokerProvider.setPort(80);
    }]);