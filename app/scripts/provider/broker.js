'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name webrtcApp.brokerProvider
 * @description
 * # peer
 * config peer connection
 */
angular.module('webrtcApp')
    .provider('broker', function () {

        var peer = '', host = '', port = '', path = '';

        /**
         * @ngdoc methode
         * @name setHost
         * @methodOf webrtcApp.brokerProvider
         * @params {String} _host set host from peer server
         * @description
         *
         * set peer server host
         *
         */
        this.setHost = function (_host) {
            host = _host;
        }

        /**
         * @ngdoc methode
         * @name setPort
         * @methodOf webrtcApp.brokerProvider
         * @params {Number} port set port for peer server
         * @description
         *
         * set peer server port
         *
         */
        this.setPort = function (_port) {
            port = _port;
        }

        /**
         * @ngdoc methode
         * @name setPath
         * @methodOf webrtcApp.brokerProvider
         * @params {String} path set path from peerServer
         * @description
         *
         * # peer
         * set path for peer server
         *
         */
        this.setPath = function (_path) {
            path = _path;
        }


        /**
         * @ngdoc service
         * @name webrtcApp.broker
         * @description
         * # peer
         * peer service
         */
        this.$get = ['$q', '$rootScope',
            function ($q, $rootScope) {

                function peerListener() {
                    peer.on('open', peerOpen);
                    peer.on('connection', function (connect) {
                        $rootScope.$apply(function () {
                            peerClientConnect(connect);
                        });
                    });
                }

                function peerOpen(id) {
                    $rootScope.$apply(function () {
                        $rootScope.$broadcast('peer:open', {id: id});
                    });
                }

                function peerClientConnect(connection) {
                    $rootScope.$broadcast('peer:clientConnect', {
                        connectId: connection.peer,
                        connection: connection
                    });
                }

                return {
                    /**
                     * @ngdoc methode
                     * @name connect
                     * @methodOf webrtcApp.broker
                     * @description
                     *
                     * # peer
                     * connect to broker server
                     *
                     */
                    connect: function () {
                        peer = new Peer({host: host, port: port, path: path});
                        peerListener();
                    },
                    /**
                     * @ngdoc methode
                     * @name getPeerId
                     * @methodOf webrtcApp.broker
                     * @description
                     *
                     * get peer id
                     *
                     */
                    getPeerId: function () {
                        return peer.id || '';
                    },
                    /**
                     * @ngdoc methode
                     * @name connectToClient
                     * @params {String} id peer id from client
                     * @methodOf webrtcApp.broker
                     * @description
                     *
                     * connect to client by client peer id
                     *
                     */
                    connectToClient: function (id) {
                        if (peer.id) {
                            peerClientConnect(peer.connect(id));
                        }
                    }
                };
            }
        ]
    });
