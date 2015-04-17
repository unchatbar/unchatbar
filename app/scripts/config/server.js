'use strict';

angular.module('unchatbar')
    .config(['BrokerProvider', 'PhoneBookProvider', 'ProfileProvider',  'LOCALSTORAGE',
        function (BrokerProvider, PhoneBookProvider, ProfileProvider,  LOCALSTORAGE) {

            if (LOCALSTORAGE === true) {
                BrokerProvider.setLocalStorage();
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
            BrokerProvider.addIceServer({
                url:"turn:192.155.86.24:3478",
                username:"easyRTC",
                credential:"easyRTC@pass"
            });
            BrokerProvider.addIceServer({
               "url": "turn:numb.viagenie.ca",
                "credential": "muazkh",
                "username": "webrtc@live.com"
            });
            
              BrokerProvider.addIceServer({
               "username":"e7db750a-2fcc-40c6-8415-cab22743a68a",
                "url":"turn:turn1.xirsys.com:443?transport=udp",
                "credential": "287ae254-9380-4f81-af88-e1cc9ed27eb0"
            });
            BrokerProvider.addIceServer({
                "username":"e7db750a-2fcc-40c6-8415-cab22743a68a",
                "url":"turn:turn1.xirsys.com:443?transport=tcp",
                "credential": "287ae254-9380-4f81-af88-e1cc9ed27eb0"
            });
            BrokerProvider.addIceServer({
                "url": "turn:192.158.29.39:3478?transport=udp",
                "credential": "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                "username": "28224511:1379330808"
            });
            BrokerProvider.addIceServer({
                "url": "turn:192.158.29.39:3478?transport=tcp",
                "credential": "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                "username": "28224511:1379330808"
            });
        }]);
