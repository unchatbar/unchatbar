'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.Connection
 * @require $rootScope
 * @description
 *
 * Wrapper for window.peer lib
 *
 */
angular.module('unchatbar')
    .service('Connection', ['$rootScope',
        function ($rootScope) {


            return {
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
                    $rootScope.$on('client:connect', function (event, data) {
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
                         * @name connection:open
                         * @eventOf unchatbar.Connection
                         * @eventType broadcast on root scope
                         * @param {String} peerId id of client
                         * @description
                         *
                         * new connection to client is open
                         *
                         */
                        $rootScope.$broadcast('connection:open', {peerId: connection.peer});
                    });
                    connection.on('close', function () {
                        delete this._connectionMap[connection.peer];
                    }.bind(this));
                    connection.on('data', function (data) {
                        $rootScope.$apply(function () {
                            /**
                             * @ngdoc event
                             * @name connection:getMessage:[action]
                             * @eventOf unchatbar.Connection
                             * @eventType broadcast on root scope
                             * @param {String} peerId id of client
                             * @param {Object} message message object
                             * @description
                             *
                             * receive message from client event name is dynamic
                             * `connection:getMessage:[data.action]`
                             *
                             */
                            $rootScope.$broadcast('connection:getMessage:' + data.action,
                                {
                                    peerId: connection.peer,
                                    message: data
                                }
                            );
                        });

                    });
                }
            };
        }
    ]);

