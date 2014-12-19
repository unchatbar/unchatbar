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
    .service('BrokerHeartbeat', ['$localStorage', '$sessionStorage', '$rootScope',
        function ($localStorage, $sessionStorage, $rootScope) {
            return {
                /**
                 * @ngdoc methode
                 * @name heartbeater
                 * @methodOf unchatbar.Broker
                 * @description
                 *
                 * heartbeater to broker server
                 *
                 */
                heartbeater: function (peer) {
                    var timeoutId = 0;

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
