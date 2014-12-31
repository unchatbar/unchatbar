'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.BrokerProvider
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
         * @methodOf unchatbar.BrokerProvider
         * @params {String} _host set host from peer server
         * @description
         *
         * set peer server host
         *
         */
        this.setHost = function (_host) {
            host = _host;
        };

        /**
         * @ngdoc methode
         * @name setPort
         * @methodOf unchatbar.BrokerProvider
         * @params {Number} port set port for peer server
         * @description
         *
         * set peer server port
         *
         */
        this.setPort = function (_port) {
            port = _port;
        };

        /**
         * @ngdoc methode
         * @name setPath
         * @methodOf unchatbar.BrokerProvider
         * @params {String} path set path from peerServer
         * @description
         *
         * # peer
         * set path for peer server
         *
         */
        this.setPath = function (_path) {
            path = _path;
        };

        /**
         * @ngdoc methode
         * @name setLocalStorage
         * @methodOf unchatbar.BrokerProvider
         * @description
         *
         * use local storage for store peerId
         *
         */
        this.setLocalStorage = function () {
            useLocalStorage = true;
        };


        /**
         * @ngdoc service
         * @name unchatbar.Broker
         * @require $rootScope
         * @require $sessionStorage
         * @require $localStorage
         * @require BrokerHeartbeat
         * @require Peer
         * @description
         *
         * peer service
         */
        this.$get = ['$rootScope', '$localStorage', '$sessionStorage', 'BrokerHeartbeat', 'Peer',
            function ($rootScope, $localStorage, $sessionStorage, BrokerHeartbeat, peerService) {
                return {
                    /**
                     * @ngdoc methode
                     * @name _storage
                     * @propertyOf unchatbar.Broker
                     * @private
                     * @returns {Object} broker storage
                     *
                     */
                    _storage : {
                      peerId : ''
                    },
                    /**
                     * @ngdoc methode
                     * @name connectServer
                     * @methodOf unchatbar.Broker
                     * @description
                     *
                     * connect to server
                     *
                     */
                    connectServer: function () {
                        this._initStorage();
                        peerService.init(this._storage.peerId, {host: host, port: port, path: path});
                        this._peerListener();
                        BrokerHeartbeat.start();
                    },

                    /**
                     * @ngdoc methode
                     * @name connect
                     * @methodOf unchatbar.Broker
                     * @params {String} id client id
                     * @description
                     *
                     * connect to client
                     *
                     */
                    connect: function (id) {
                        var connection = peerService.get().connect(id);
                        $rootScope.$broadcast('client:connect', {
                            connection: connection
                        });
                    },

                    /**
                     * @ngdoc methode
                     * @name connect
                     * @methodOf unchatbar.Broker
                     * @params {String} id client id
                     * @description
                     *
                     * connect to client
                     * TODO TEST
                     */
                    connectStream: function (id,stream) {
                        peerService.get().call(id,stream);
                    },


                    /**
                     * @ngdoc methode
                     * @name getPeerId
                     * @methodOf unchatbar.Broker
                     * @return {String} own peer id
                     * @description
                     *
                     * get peer id
                     *
                     */
                    getPeerId: function () {
                        return peerService.get().id || '';
                    },

                    /**
                     * @ngdoc methode
                     * @name _initStorage
                     * @methodOf unchatbar.Broker
                     * @description
                     *
                     * init storage
                     *
                     */
                    _initStorage : function() {
                        var storage = useLocalStorage ? $localStorage : $sessionStorage;
                        this._storage = storage.$default({
                            broker: {
                                peerId: ''
                            }
                        }).broker;
                    },

                    /**
                     * @ngdoc methode
                     * @name _peerListener
                     * @methodOf unchatbar.Broker
                     * @private
                     * @description
                     *
                     * listen to peer server
                     *
                     */
                    _peerListener: function () {
                        var peer = peerService.get();

                        peer.on('open', function (id) {
                            $rootScope.$apply(function () {
                                this._storage.peerId = id;
                                /**
                                 * @ngdoc event
                                 * @name peer:open
                                 * @eventOf unchatbar.Broker
                                 * @eventType broadcast on root scope
                                 * @description
                                 *
                                 * Broadcasted after peer server connection is open
                                 *
                                 * @param {String} id own peer id
                                 */
                                $rootScope.$broadcast('peer:open', {id: id});
                            }.bind(this));
                        }.bind(this));
                        //TODO TEST
                        peer.on('call', function (call) {
                            $rootScope.$apply(function () {

                                /**
                                 * @ngdoc event
                                 * @name peer:open
                                 * @eventOf unchatbar.Broker
                                 * @eventType broadcast on root scope
                                 * @description
                                 *
                                 * Broadcasted after peer server connection is open
                                 *
                                 * @param {String} id own peer id
                                 */
                                $rootScope.$broadcast('peer:call', {call: call});
                            }.bind(this));
                        }.bind(this));
                        //TODO TEST
                        peer.on('call', function (stream) {
                            $rootScope.$apply(function () {

                                /**
                                 * @ngdoc event
                                 * @name peer:open
                                 * @eventOf unchatbar.Broker
                                 * @eventType broadcast on root scope
                                 * @description
                                 *
                                 * Broadcasted after peer server connection is open
                                 *
                                 * @param {String} id own peer id
                                 */
                                $rootScope.$broadcast('peer:addStream', {stream: stream});
                            }.bind(this));
                        }.bind(this));

                        peer.on('connection', function (connect) {
                            $rootScope.$apply(function () {
                                /**
                                 * @ngdoc event
                                 * @name client:connect
                                 * @eventOf unchatbar.Broker
                                 * @eventType broadcast on root scope
                                 * @description
                                 *
                                 * Broadcasted after client connect
                                 *
                                 * @param {Object} connection client connection
                                 */
                                $rootScope.$broadcast('client:connect', {connection: connect});
                            });
                        });

                        peer.on('error', function (error) {
                            $rootScope.$apply(function () {
                                /**
                                 * @ngdoc event
                                 * @name peer:error
                                 * @eventOf unchatbar.Broker
                                 * @eventType broadcast on root scope
                                 * @description
                                 *
                                 * Broadcasted after error in peer conncetion
                                 *
                                 * @param {Object} error error object
                                 */
                                $rootScope.$broadcast('peer:error', {error: error});
                            });
                        });
                    }
                };
            }
        ];
    }
);
