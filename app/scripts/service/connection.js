'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.Connection
 * @require $rootScope
 * @require Broker
 * @description
 *
 * Wrapper for window.peer lib
 *
 */
angular.module('unchatbar')
    .service('Connection', ['$rootScope',
        function ($rootScope) {


            var api =  {
                /**
                 * @ngdoc methode
                 * @name _connectionMap
                 * @propertyOf unchatbar.Connection
                 * @private
                 * @returns {Object} connection storage
                 *
                 */
                _connectionMap : {},

                /**
                 * @ngdoc methode
                 * @name init
                 * @methodOf unchatbar.Connection
                 * @description
                 *
                 * init listener
                 *
                 */
                init: function () {
                    $rootScope.$on('BrokerPeerConnection', function (event, data) {
                        this._add(data.connection);
                    }.bind(this));
                },

                /**
                 * @ngdoc methode
                 * @name send
                 * @methodOf unchatbar.Connection
                 * @params {String} id client peerId
                 * @params {String} message message for client
                 * @return {Boolean} send to client was successfully
                 * @description
                 *
                 * send message to client
                 *
                 */
                send: function (id, message) {
                    if (this._connectionMap[id]) {
                        this._connectionMap[id].send(message);
                        return true;
                    }
                    return false;
                },

                /**
                 * @ngdoc methode
                 * @name getMap
                 * @methodOf unchatbar.Connection
                 * @return {Object} list of all active client connections
                 * @description
                 *
                 * get map of all client connections
                 *
                 */
                getMap : function () {
                    return this._connectionMap;
                },
                /**
                 * @ngdoc methode
                 * @name add
                 * @methodOf unchatbar.Connection
                 * @param {Object} connection client connection
                 * @private
                 * @description
                 *
                 * add a new client connection
                 *
                 */
                _add: function (connection) {
                    this._connectionMap[connection.peer] = connection;

                    connection.on('open', function () {
                        /**
                         * @ngdoc event
                         * @name ConnectionOpen
                         * @eventOf unchatbar.Connection
                         * @eventType broadcast on root scope
                         * @param {String} peerId id of client
                         * @description
                         *
                         * new connection to client is open
                         *
                         */
                        $rootScope.$broadcast('ConnectionOpen', {peerId: this.peer});
                    });
                    connection.on('close', function () {
                        delete api._connectionMap[this.peer];
                    });
                    connection.on('data', function (data) {
                        var  peerId = this.peer;
                        $rootScope.$apply(function () {
                            /**
                             * @ngdoc event
                             * @name ConnectionGetMessage[action]
                             * @eventOf unchatbar.Connection
                             * @eventType broadcast on root scope
                             * @param {String} peerId id of client
                             * @param {Object} message message object
                             * @description
                             *
                             * receive message from client event name is dynamic
                             * `ConnectionGetMessage[data.action]`
                             *
                             */
                            $rootScope.$broadcast('ConnectionGetMessage' + data.action,
                                {
                                    peerId: peerId,
                                    message: data
                                }
                            );
                        });
                    });
                }
            };
            return api;
        }
    ]);

