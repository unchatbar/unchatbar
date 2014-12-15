angular.module('unchatbar')
    .config(['brokerProvider', function (brokerProvider) {
        brokerProvider.setHost('unchatbar-server.herokuapp.com');
        brokerProvider.setPort(80);
    }]);