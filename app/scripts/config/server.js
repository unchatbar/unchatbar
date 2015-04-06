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
            BrokerProvider.addIceServer({url: 'stun:23.21.150.121'});
            BrokerProvider.addIceServer({url: 'stun:stun.l.google.com:19302'});
            BrokerProvider.addIceServer({url: 'stun:stun.anyfirewall.com:3478'});
            BrokerProvider.addIceServer({
                url: 'turn:turn.bistri.com:80',
                credential: 'homeo',
                username: 'homeo'
            });
            BrokerProvider.addIceServer({
                url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                credential: 'webrtc',
                username: 'webrtc'
            });
            BrokerProvider.addIceServer({
                url: 'turn:numb.viagenie.ca',
                credential: 'webrtcdemo',
                username: 'louis%40mozilla.com'
            });
            BrokerProvider.setSecureConnection(true);

        }]);
