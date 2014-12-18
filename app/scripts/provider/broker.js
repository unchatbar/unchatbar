'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.brokerProvider
 * @description
 * # peer
 * config peer connection
 */
angular.module('unchatbar')
    .provider('Broker', function () {

        var host = '', port = '', path = '', useLocalStorage = false;

        /**
         * @ngdoc methode
         * @name setHost
         * @methodOf unchatbar.brokerProvider
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
         * @methodOf unchatbar.brokerProvider
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
         * @methodOf unchatbar.brokerProvider
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
         * @name setLocalStorage
         * @methodOf unchatbar.brokerProvider
         * @params {String} path set path from peerServer
         * @description
         *
         * use local storage for store peerId
         *
         */
        this.setLocalStorage = function () {
            useLocalStorage = true;
        }


        /**
         * @ngdoc service
         * @name unchatbar.broker
         * @description
         * # peer
         * peer service
         */
        this.$get = ['$q', '$rootScope', 'notify', '$localStorage', '$sessionStorage', 'BrokerHeartbeat','peer',
            function ($q, $rootScope, notify, $localStorage, $sessionStorage, BrokerHeartbeat, peerService) {
                var storage = useLocalStorage ? $localStorage : $sessionStorage,
                    peer = peerService.get();

                storage = storage.$default({
                    broker: {
                        peerId: ''
                    }
                }).broker;



                function peerListener() {
                    peer.on('open', function (id) {
                        $rootScope.$apply(function () {
                            storage.peerId = id;
                            $rootScope.$broadcast('peer:open', {id: id});
                        });
                    });

                    peer.on('connection', function (connect) {
                        $rootScope.$apply(function () {
                            $rootScope.$broadcast('client:connect', {connection: connect});
                        });
                    });

                    peer.on('error', function (error) {
                        notify({
                            message: error.message,
                            classes: 'alert alert-danger',
                            templateUrl: ''

                        });
                    });
                }


                return {

                    /**
                     * @ngdoc methode
                     * @name connect
                     * @methodOf unchatbar.broker
                     * @description
                     *
                     * # peer
                     * connect to broker server
                     *
                     */
                    connectServer: function () {
                        peer = new Peer(storage.peerId, {host: host, port: port, path: path});
                        peerListener();
                        BrokerHeartbeat.heartbeater(peer);


                    },
                    connect : function (id){
                        return peer.connect(id);
                    },
                    getPeer: function () {
                        return peer;
                    },
                    /**
                     * @ngdoc methode
                     * @name getPeerId
                     * @methodOf unchatbar.broker
                     * @description
                     *
                     * get peer id
                     *
                     */
                    getPeerId: function () {
                        return peer.id || '';
                    }

                };
            }
        ]
    }
);
