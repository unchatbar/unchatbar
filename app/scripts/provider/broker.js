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

        var peer = '', host = '', port = '', path = '', useLocalStorage = false;

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
         * @ngdoc methode
         * @name setLocalStroage
         * @methodOf webrtcApp.brokerProvider
         * @params {String} path set path from peerServer
         * @description
         *
         * use local storage for store peerId
         *
         */
        this.setLocalStroage = function () {
            useLocalStorage = true;
        }


        /**
         * @ngdoc service
         * @name webrtcApp.broker
         * @description
         * # peer
         * peer service
         */
        this.$get = ['$q', '$rootScope','notify','$localStorage','$sessionStorage',
            function ($q, $rootScope, notify,$localStorage,$sessionStorage) {
                var storage = useLocalStorage ? $localStorage : $sessionStorage,
                    activeConnections= {};

                storage = storage.$default({
                    broker :{
                        peerId : '',
                        connections : {}
                    }
                }).broker;

                function peerListener() {
                    peer.on('open', function(id) {
                        $rootScope.$apply(function () {
                            storage.peerId = id;
                            $rootScope.$broadcast('peer:open', {id: id});
                        });
                    });
                    peer.on('connection', function (connect) {
                        $rootScope.$apply(function () {
                            peerClientConnect(connect);
                        });
                    });
                    peer.on('error', function (error) {
                        notify({
                            message:error.message,
                            classes:'alert alert-danger',
                            templateUrl : ''

                        });
                    });
                }

                function peerClientConnect(connection) {
                    storage.connections[connection.peer] = true;
                    activeConnections[connection.peer] = connection;
                    $rootScope.$broadcast('peer:clientConnect', {
                        connectId: connection.peer,
                        connection: connection
                    });
                }

                return {
                    /**
                     * @ngdoc methode
                     * @name getMapOfClientCalled
                     * @methodOf webrtcApp.broker
                     * @return {Object} map of called client's
                     * @description
                     *
                     * get called connections from storage
                     *
                     */
                    getMapOfClientCalled : function () {
                        return storage.connections;
                    },
                    removeClientCalled : function (peerId) {
                        return delete storage.connections[peerId];
                    },

                    /**
                     * @ngdoc methode
                     * @name getMapOfActiveClients
                     * @methodOf webrtcApp.broker
                     * @return {Object} map of active connection
                     * @description
                     *
                     * get map of called called clients
                     *
                     */
                    getMapOfActiveClients : function () {
                        return activeConnections;
                    },
                    /**
                     * @ngdoc methode
                     * @name removeClientFromCalledMap
                     * @params {String} connectionId connection id of client
                     * @methodOf webrtcApp.broker
                     * @description
                     *
                     * remove connection from active connection list
                     *
                     */
                    removeClientFromCalledMap : function (connectionId) {
                      delete activeConnections[connectionId];
                    },
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
                        peer = new Peer(storage.peerId,{host: host, port: port, path: path});
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
                        } else {
                            notify({
                                message:'connect to client failed, no peerId',
                                classes:'alert alert-danger',
                                templateUrl : ''

                            });
                        }
                    }
                };
            }
        ]
    });
