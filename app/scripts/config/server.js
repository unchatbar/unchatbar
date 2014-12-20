angular.module('unchatbar')
    .config(['BrokerProvider', 'LOCALSTORAGE', function (BrokerProvider, LOCALSTORAGE) {
        if (LOCALSTORAGE === true) {
            BrokerProvider.setLocalStorage();

        }
        BrokerProvider.setHost('unchatbar-server.herokuapp.com');
        BrokerProvider.setPort(80);
    }]);