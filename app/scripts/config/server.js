'use strict';

angular.module('unchatbar')
    .config(['BrokerProvider', 'PhoneBookProvider', 'ProfileProvider',  'LOCALSTORAGE', 'DataConnectionProvider',
        function (BrokerProvider, PhoneBookProvider, ProfileProvider,  LOCALSTORAGE, DataConnectionProvider) {

            if (LOCALSTORAGE === true) {
                BrokerProvider.setLocalStorage();
                DataConnectionProvider.setLocalStorage();
                ProfileProvider.setLocalStorage();
                PhoneBookProvider.setLocalStorage();
            }
            BrokerProvider.setHost('unchatbar-server.herokuapp.com');

            BrokerProvider.setSecureConnection(true);
            window.turnserversDotComAPI.iceServers(function(iceServers) {
                _.forEach(iceServers,function(server){
                    var username;
                    if (username = server.url.match(/turn:(.*)@/)){
                        server.username= username[1];
                        server.url = server.url.replace(server.username + '@','');
                    }
                    BrokerProvider.addIceServer(server);
                });
            });
        }]);
