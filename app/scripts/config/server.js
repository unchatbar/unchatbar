'use strict';

angular.module('unchatbar')
    .config(['BrokerProvider','PhoneBookProvider','ProfileProvider', 'LOCALSTORAGE', function (BrokerProvider,PhoneBookProvider,ProfileProvider, LOCALSTORAGE) {
        if (LOCALSTORAGE === true) {
            BrokerProvider.setLocalStorage();
            ProfileProvider.setLocalStorage();
            PhoneBookProvider.setLocalStorage();


        }
        BrokerProvider.setHost('unchatbar-server.herokuapp.com');
        BrokerProvider.setPort(80);
    }]);