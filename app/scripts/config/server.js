'use strict';

angular.module('unchatbar')
    .config(['BrokerProvider','PhoneBookProvider','ProfileProvider','MessageTextProvider', 'LOCALSTORAGE',
        function (BrokerProvider,PhoneBookProvider,ProfileProvider,MessageTextProvider, LOCALSTORAGE) {

        if (LOCALSTORAGE === true) {
            BrokerProvider.setLocalStorage();
            ProfileProvider.setLocalStorage();
            PhoneBookProvider.setLocalStorage();
            MessageTextProvider.setLocalStorage();


        }
        BrokerProvider.setHost('unchatbar-server.herokuapp.com');
        //BrokerProvider.setPort(80);
    }]);