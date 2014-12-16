angular.module('unchatbar')
    .config(['brokerProvider','LOCALSTORAGE', function (brokerProvider,LOCALSTORAGE) {
        if(LOCALSTORAGE === true) {
            brokerProvider.setLocalStroage();
        }
        brokerProvider.setHost('unchatbar-server.herokuapp.com');
        brokerProvider.setPort(80);
    }]);