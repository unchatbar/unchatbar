'use strict';

angular.module('unchatbar')
    .config(['BrokerProvider','PhoneBookProvider','ProfileProvider','MessageTextProvider', 'LOCALSTORAGE', function (BrokerProvider,PhoneBookProvider,ProfileProvider, LOCALSTORAGE) {
        if (LOCALSTORAGE === true) {
            BrokerProvider.setLocalStorage();
            ProfileProvider.setLocalStorage();
            PhoneBookProvider.setLocalStorage();
            MessageText.setLocalStorage();


        }
        BrokerProvider.setHost('unchatbar-server.herokuapp.com');
        BrokerProvider.setPort(80);
    }]);