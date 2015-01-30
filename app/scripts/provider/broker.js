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

        var host = '',
            port = '',
            path = '',
            useLocalStorage = false,
            useSecureConnection=false,
            brokerDebugLevel = 0,
            iceServer = [];

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
         * @name addIceServer
         * @methodOf unchatbar.BrokerProvider
         * @params {Object} server ice server
         * @description
         *
         * add ice server
         *
         */
        this.addIceServer = function (server) {
            iceServer.push(server);
        };

        /**
         * @ngdoc methode
         * @name setSecureConnection
         * @methodOf unchatbar.BrokerProvider
         * @params {Boolean} _useSecureConnection set use secure connection
         * @description
         *
         * set secure connection for broker server
         *
         */
        this.setSecureConnection = function (_useSecureConnection) {
            useSecureConnection = _useSecureConnection ? true : false;
        };

        /**
         * @ngdoc methode
         * @name setSecureConnection
         * @methodOf unchatbar.BrokerProvider
         * @params {Number} _brokerDebug debug level
         * @description
         *
         * set broker debug level
         *
         */
        this.setSecureConnection = function (_brokerDebugLevel) {
            brokerDebugLevel = _brokerDebugLevel;
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
         * @require Peer
         * @description
         *
         * peer service
         */
        this.$get = ['$rootScope', '$localStorage', '$sessionStorage', 'Peer',
            function ($rootScope, $localStorage, $sessionStorage, peerService) {
                //TODO ON VIEW CHANGE START connectServer
                var api =  {

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
                     * @name initStorage
                     * @methodOf unchatbar.Broker
                     * @description
                     *
                     * init storage
                     *
                     */
                    initStorage : function() {
                        var storage = useLocalStorage ? $localStorage : $sessionStorage;
                        this._storage = storage.$default({
                            broker: {
                                peerId: ''
                            }
                        }).broker;
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
                        peerService.init(this._storage.peerId, 
                        {host: host,  port: port, 
                        path: path,
                        config: {'iceServers':iceServer},
                        secure:useSecureConnection,
                        debug: brokerDebugLevel
                        });
                        this._peerListener();
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
                        var connection = peerService.get().connect(id,{reliable:true});
                        $rootScope.$broadcast('BrokerPeerConnection', {
                            connection: connection
                        });
                    },

                    /**
                     * @ngdoc methode
                     * @name connectStream
                     * @methodOf unchatbar.Broker
                     * @params {String} id client id
                     * @params {String} id client id
                     * @params {Object} streamOption audio/video option
                     * @description
                     *
                     * connect a stream to client
                     *
                     */
                    connectStream: function (id,stream,metaData) {
                        var streamCall = peerService.get().call(id,stream,{metadata:metaData});
                        return streamCall;
                    },

                    /**
                     * @ngdoc methode
                     * @name setPeerId
                     * @methodOf unchatbar.Broker
                     * @params {String} peerId peerId
                     * @return {String} own peer id
                     * @description
                     *
                     * set peer id
                     *
                     */
                    setPeerId : function (peerId) {
                        api._storage.peerId = peerId;
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
                     * @name getPeerIdFromStorage
                     * @methodOf unchatbar.Broker
                     * @return {String} own peer id
                     * @description
                     *
                     * get peer id from storage
                     *
                     */
                    getPeerIdFromStorage: function () {
                        return this._storage.peerId;
                    },

                    /**
                     * @ngdoc methode
                     * @name _isBrowserOnline
                     * @methodOf unchatbar.Broker
                     * @returns {Boolean} navigator.onLine
                     * @description
                     *
                     * helper for is browser online
                     *
                     */
                    _isBrowserOnline : function() {
                        return navigator.onLine;
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

                        peer.on('open', function (peerId) {
                            api._onOpen(peerId);
                        });

                        peer.on('call', function (call) {
                            api._onCall(call);
                        });

                        peer.on('connection', function (connection) {
                            api._onConnection(connection);
                        });

                        peer.on('error', function (error) {
                            api._onError(error);
                        });

                    },
                    /**
                     * @ngdoc methode
                     * @name _onOpen
                     * @methodOf unchatbar.Broker
                     * @params {String} peerId peerId
                     * @description
                     *
                     * handle peer open
                     *
                     */
                    _onOpen : function (peerId) {
                        $rootScope.$apply(function () {
                            api.setPeerId(peerId);
                            /**
                             * @ngdoc event
                             * @name BrokerPeerOpen
                             * @eventOf unchatbar.Broker
                             * @eventType broadcast on root scope
                             * @description
                             *
                             * Broadcasted after peer server connection is open
                             *
                             * @param {String} id own peer id
                             */
                            $rootScope.$broadcast('BrokerPeerOpen', {id: peerId});
                        });
                    },
                    /**
                     * @ngdoc methode
                     * @name _onCall
                     * @methodOf unchatbar.Broker
                     * @params {Object} call connection
                     * @description
                     *
                     * handle peer call
                     *
                     */
                    _onCall : function (call) {
                        $rootScope.$apply(function () {

                            /**
                             * @ngdoc event
                             * @name BrokerPeerOpen
                             * @eventOf unchatbar.Broker
                             * @eventType broadcast on root scope
                             * @description
                             *
                             * Broadcasted after get client call for stream
                             *
                             * @param {Object} call client call
                             */
                            $rootScope.$broadcast('BrokerPeerCall', {client: call});
                        });
                    },

                    /**
                     * @ngdoc methode
                     * @name _onConnection
                     * @methodOf unchatbar.Broker
                     * @params {Object} connection connection
                     * @description
                     *
                     * handle peer connection
                     *
                     */
                    _onConnection : function (connection) {
                        $rootScope.$apply(function () {
                            /**
                             * @ngdoc event
                             * @name BrokerPeerConnection
                             * @eventOf unchatbar.Broker
                             * @eventType broadcast on root scope
                             * @description
                             *
                             * Broadcasted after client connect
                             *
                             * @param {Object} connection client connection
                             */
                            $rootScope.$broadcast('BrokerPeerConnection', {connection: connection});
                        });
                    },

                    /**
                     * @ngdoc methode
                     * @name _onConnection
                     * @methodOf unchatbar.Broker
                     * @params {Object} error connection
                     * @description
                     *
                     * handle peer error
                     *
                     */
                    _onError : function (error) {
                        /**
                         * @ngdoc event
                         * @name BrokerPeerError
                         * @eventOf unchatbar.Broker
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * Broadcasted after error in peer conncetion
                         *
                         * @param {Object} error error object
                         */
                        $rootScope.$broadcast('BrokerPeerError', {error: error});

                    }
                };

                return api;
            }
        ];
    }
);
