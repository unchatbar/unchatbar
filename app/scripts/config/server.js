angular.module('unchatbar')
    .config(['BrokerProvider', 'PhoneBookProvider', 'LOCALSTORAGE', function (BrokerProvider, PhoneBookProvider, LOCALSTORAGE) {
        if (LOCALSTORAGE === true) {
            BrokerProvider.setLocalStorage();
            PhoneBookProvider.setLocalStorage();
        }
        BrokerProvider.setHost('unchatbar-server.herokuapp.com');
        BrokerProvider.setPort(80);
    }]);