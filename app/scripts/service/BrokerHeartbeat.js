'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.BrokerHeartbeat
 * @description
 *
 * heartbeate to server
 */
angular.module('unchatbar')
    .service('BrokerHeartbeat', ['Peer',
        function (Peer) {
            return {
                /**
                 * @ngdoc methode
                 * @name heartbeater
                 * @methodOf unchatbar.BrokerHeartbeat
                 * @description
                 *
                 * heartbeater to broker server
                 *
                 */
                start: function () {
                    var timeoutId = 0;
                    var peer = Peer.get();
                    function heartbeat() {
                        timeoutId = setTimeout(heartbeat, 20000);
                        if (peer.socket._wsOpen()) {
                            peer.socket.send({type: 'HEARTBEAT'});
                        }
                    }
                    if (peer.socket) {
                        heartbeat();
                    }

                }
            };
        }
    ]
);
