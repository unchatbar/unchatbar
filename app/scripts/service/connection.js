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
    .service('Connection', ['$rootScope','Broker','notify',
        function ($rootScope,Broker,notify) {


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
                        notify('receive connection from Broker' , data.connection.peer);
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
                        notify('send data to'  + id +'action'+message.action
                        +'<br>text' + message.text);
                        this._connectionMap[id].send(message);
                    } else {
                        notify('no send reconnect to '  + id );
                        Broker.connect(id);
                    }
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
                    connection.on('open', function () {
                        notify('connection open:' + this.peer);
                        api._connectionMap[this.peer] = this;
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
                        notify('connection close ' + this.peer);
                        delete api._connectionMap[this.peer];
                    });
                    connection.on('error', function (err) {
                        notify('connection error ' + this.peer + "-->"+ err);
                    });
                    connection.on('data', function (data) {
                        notify('connection get data' +
                        '<br>peer' + this.peer +
                        '<br>ACTION' + data.action);
                        var  peerId = this.peer;

                        $rootScope.$apply(function () {
                            if(data.action !== 'readMessage' && data.id) {
                                api.send(peerId, {action: 'readMessage', id: data.id});
                            }
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

