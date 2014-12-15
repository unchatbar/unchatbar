angular.module('unchatbar')
    .config(['brokerProvider', function (brokerProvider) {
        brokerProvider.setHost('localhost');
        brokerProvider.setPort(9000);
    }]);