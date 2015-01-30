'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.Stream
 * @require $rootScope
 * @require $q
 * @require Broker
 * @require Profile
 * @require Connection
 * @description
 * # peer
 * manage stream connection's
 */
angular.module('unchatbar')
    .service('Stream', ['$timeout', '$rootScope', '$q', 'Broker', 'Profile', 'Connection',
        function ($timeout, $rootScope, $q, Broker, Profile, Connection) {


            var api = {
                /**
                 * @ngdoc methode
                 * @name _stream
                 * @propertyOf unchatbar.Stream
                 * @private
                 * @returns {Object} store for user/client streams
                 *
                 */
                _stream: {
                    stream: {
                        single: {},
                        conference: {}
                    },
                    ownStream: {}
                },

                /**
                 * @ngdoc methode
                 * @name _callForWaitingAnswer
                 * @propertyOf unchatbar.Stream
                 * @private
                 * @returns {Object} Called without an answer
                 *
                 */
                _callForWaitingAnswer: {},



                /**
                 * @ngdoc methode
                 * @name callUser
                 * @methodOf unchatbar.Stream
                 * @params {String} peerId Id of peer client
                 * @params {Object} streamOption audio/video option
                 * @description
                 *
                 * call to client
                 *
                 */
                callUser: function (peerId, streamOption) {
                    this.createOwnStream(streamOption).then(function (stream) {
                        api._listenOnClientStreamConnection(Broker.connectStream(peerId, stream,
                            {profile: Profile.get(), type: 'single', streamOption: streamOption}
                        ));
                    });
                },

                /**
                 * @ngdoc methode
                 * @name callConference
                 * @methodOf unchatbar.Stream
                 * @params {String} peerId Id of peer client
                 * @params {Object} streamOption audio/video option
                 * @description
                 *
                 * call client to conference
                 *
                 */
                callConference: function (roomId, peerId, streamOption, ownStream) {
                    if (api.getConferenceClient(peerId) === null &&
                        Broker.getPeerId() !== peerId) {
                        api._listenOnClientStreamConnection(Broker.connectStream(peerId, ownStream, {
                            profile: Profile.get(),
                            roomId: roomId,
                            streamOption: streamOption,
                            type: 'conference'
                        }));

                    }
                },

                /**
                 * @ngdoc methode
                 * @name getOwnStream
                 * @methodOf unchatbar.Stream
                 * @params {Object} streamOption audio/video option
                 * @returns {Object} own stream
                 * @description
                 *
                 * get own stream
                 *
                 */
                getOwnStream: function (streamOption) {
                    var key = this._getOwnStreamKeyByOption(streamOption);
                    return this._stream.ownStream[key] || null;
                },

                /**
                 * @ngdoc methode
                 * @name getConferenceClientsMap
                 * @methodOf unchatbar.Stream
                 * @returns {Object} own stream
                 * @description
                 *
                 * get all glients from conference
                 *
                 */
                getConferenceClientsMap: function () {
                    return this._stream.stream.conference;
                },

                /**
                 * @ngdoc methode
                 * @name getConferenceClientsMap
                 * @methodOf unchatbar.Stream
                 * @param {String} peerId Id client
                 * @returns {Object} own stream
                 * @description
                 *
                 * get client from conference
                 *
                 */
                getConferenceClient: function (peerId) {
                    return this._stream.stream.conference[peerId] || null;
                },

                /**
                 * @ngdoc methode
                 * @name getClientStream
                 * @methodOf unchatbar.Stream
                 * @param {String} streamId Id of stream
                 * @returns {Object} own stream
                 * @description
                 *
                 * get client stream by stream id
                 *
                 */
                getClientStream: function (streamId) {
                    return this._stream.stream.single[streamId];
                },

                /**
                 * @ngdoc methode
                 * @name getClientStreamMap
                 * @methodOf unchatbar.Stream
                 * @returns {Object} own stream
                 * @description
                 *
                 * get a map of all client stream
                 *
                 */
                getClientStreamMap: function () {
                    return this._stream.stream.single;
                },

                /**
                 * @ngdoc methode
                 * @name closeAllOwnMedia
                 * @methodOf unchatbar.Stream
                 * @returns {Object} own stream
                 * @description
                 *
                 * close all won media streams
                 *
                 */
                closeAllOwnMedia: function () {
                    _.forEach(this._stream.ownStream, function (stream, key) {
                        stream.stop();
                        delete this._stream.ownStream[key];
                    }.bind(this));
                    /**
                     * @ngdoc event
                     * @name StreamCloseOwn
                     * @eventOf unchatbar.Stream
                     * @eventType broadcast on root scope
                     * @description
                     *
                     * all own streams are closed
                     *
                     */
                    $rootScope.$broadcast('StreamCloseOwn', {});
                },

                /**
                 * @ngdoc methode
                 * @name getCallsForAnswerMap
                 * @methodOf unchatbar.Stream
                 * @description
                 *
                 * get all calls, waiting for answer
                 *
                 */
                getCallsForAnswerMap: function () {
                    return this._callForWaitingAnswer;
                },

                /**
                 * @ngdoc methode
                 * @name addCallToAnswer
                 * @methodOf unchatbar.Stream
                 * @params {Object} connection connection
                 * @description
                 *
                 * add new call connection
                 *
                 */
                addCallToAnswer: function (connection) {
                    this._callForWaitingAnswer[connection.peer] = connection;
                    /**
                     * @ngdoc event
                     * @name addStreamCall
                     * @eventOf unchatbar.Stream
                     * @eventType broadcast on root scope
                     * @description
                     *
                     * add connection to waiting calling list
                     *
                     */
                    $rootScope.$broadcast('StreamAddClient');
                },


                /**
                 * @ngdoc methode
                 * @name _onBrokerCall
                 * @methodOf unchatbar.Stream
                 * @params {Object} connection connection
                 * @description
                 *
                 * handle peer call
                 *
                 */
                answerCall: function (connection) {
                    delete this._callForWaitingAnswer[connection.peer];
                    var streamOption = connection.metadata.streamOption;
                    this.createOwnStream(streamOption).then(function (stream) {
                        connection.answer(stream);
                        api._listenOnClientStreamConnection(connection);
                    });
                },

                /**
                 * @ngdoc methode
                 * @name _onBrokerCall
                 * @methodOf unchatbar.Stream
                 * @params {Object} connection connection
                 * @params {Object} streamOption audio/video option
                 * @description
                 *
                 * handle peer call
                 *
                 */
                cancelCall: function (connection) {
                    connection.close();
                    if (connection.metadata.type === 'single') {
                        this.removeSingleStreamClose(connection.peer);
                    } else if (connection.metadata.type === 'conference') {
                        this.removeConferenceStreamClose(connection.peer);
                    }
                },

                /**
                 * @ngdoc methode
                 * @name createOwnStream
                 * @methodOf unchatbar.Stream
                 * @params {Object} streamOption audio/video option
                 * @returns {Object} promise
                 * @private
                 * @description
                 *
                 * create own stream
                 *
                 */
                createOwnStream: function (streamOption) {
                    var defer = $q.defer();
                    navigator.getUserMedia = this._getUserMediaApi();
                    if (navigator.getUserMedia === 0) {
                        defer.reject('no media api');
                    } else if (this.getOwnStream(streamOption)) {
                        defer.resolve(this.getOwnStream(streamOption));
                    } else {
                        navigator.getUserMedia(
                            streamOption,
                            function (stream) {
                                var key = this._getOwnStreamKeyByOption(streamOption);
                                this._stream.ownStream[key] = stream;
                                /**
                                 * @ngdoc event
                                 * @name StreamAddOwn
                                 * @eventOf unchatbar.Stream
                                 * @eventType broadcast on root scope
                                 * @description
                                 *
                                 * new own stream created
                                 *
                                 */
                                $rootScope.$broadcast('StreamAddOwn', {streamOption: streamOption});
                                defer.resolve(stream);
                            }.bind(this),
                            function (error) {
                                return defer.reject(error);
                            }
                        );
                    }
                    return defer.promise;
                },

                /**
                 * @ngdoc methode
                 * @name _getOwnStreamKeyByOption
                 * @methodOf unchatbar.Stream
                 * @params {Object} streamOption audio/video option
                 * @returns {String} storage key
                 * @private
                 * @description
                 *
                 * get key for streamOption
                 *
                 */
                _getOwnStreamKeyByOption: function (streamOption) {
                    var storageKey = '';
                    _(streamOption).forEach(function (value, key) {
                        storageKey += key + '_' + value;
                    });
                    return storageKey;
                },

                /**
                 * @ngdoc methode
                 * @name _getUserMediaApi
                 * @methodOf unchatbar.Stream
                 * @returns {Object} usermedia Api
                 * @private
                 * @description
                 *
                 * get usermedia api for browser
                 *
                 */
                _getUserMediaApi: function () {
                    return ( navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia);
                },

                /**
                 * @ngdoc methode
                 * @name _addEmptyStreamCall
                 * @methodOf unchatbar.Stream
                 * @param {Object} call connection call
                 * @private
                 * @description
                 *
                 * add calls to storage without streams
                 *
                 */
                _addEmptyStreamCall: function (call) {
                    if (call.metadata.type === 'single') {
                        api._addSingleStream(call, null);
                    } else if (call.metadata.type === 'conference') {
                        api._addConferenceStream(call, null);

                    }
                },

                /**
                 * @ngdoc methode
                 * @name _listenOnClientStreamConnection
                 * @methodOf unchatbar.Stream
                 * @param {Object} call connection call
                 * @private
                 * @description
                 *
                 * listen to stream event after call
                 *
                 */
                _listenOnClientStreamConnection: function (call) {
                    api._addEmptyStreamCall(call);
                    call.on('stream', function (stream) {
                        if (this.metadata.type === 'single') {
                            if (api.getClientStream(this.peer)) {
                                api._addSingleStream(this, stream);
                            } else {
                                this.close();
                            }
                            $rootScope.$apply();
                        } else if (this.metadata.type === 'conference') {

                            if (api.getConferenceClient(this.peer)) {
                                api._addConferenceStream(this, stream);
                                api._sendOwnUserFromConference(this.peer);
                            } else {
                                this.close();
                            }
                            $rootScope.$apply();
                        }

                    });
                    call.on('close', function () {
                        if (this.metadata.type === 'single') {
                            api.removeSingleStreamClose(this.peer);
                        } else if (this.metadata.type === 'conference') {
                            api.removeConferenceStreamClose(this.peer);
                        }
                    });
                },

                /**
                 * @ngdoc methode
                 * @name _sendOwnUserFromConference
                 * @methodOf unchatbar.Stream
                 * @param {Object} peerId client peer id
                 * @private
                 * @description
                 *
                 * send own group user to streaming client
                 *
                 */
                _sendOwnUserFromConference: function (peerId) {
                    Connection.send(peerId, {
                        action: 'updateStreamGroup',
                        users: _.keys(api.getConferenceClientsMap())
                    });
                },

                /**
                 * @ngdoc methode
                 * @name _callToGroupUsersFromClient
                 * @methodOf unchatbar.Stream
                 * @param {Object} _peerId client peer id
                 * @param {Array} users client stream users
                 * @private
                 * @description
                 *
                 * create stream connection to all conference user from client
                 *
                 */
                _callToGroupUsersFromClient: function (_peerId, users) {
                    var streamOption, roomId;
                    if (api.getConferenceClient(_peerId) !== null) {
                        streamOption = api.getConferenceClient(_peerId).option;
                        roomId = api.getConferenceClient(_peerId).roomId;
                        this.createOwnStream(streamOption).then(function (stream) {
                            _.forEach(users, function (peerId) {
                                api.callConference(roomId, peerId, streamOption, stream);
                            });
                        });
                    }
                },

                /**
                 * @ngdoc methode
                 * @name _addSingleStream
                 * @methodOf unchatbar.Stream
                 * @param {Object} connection client connection
                 * @param {Object} stream client stream
                 * @private
                 * @description
                 *
                 * handle single stream start
                 *
                 */
                _addSingleStream: function (connection, stream) {
                    api._stream.stream.single[connection.peer] = {
                        stream: stream,
                        peerId: connection.peer,
                        call: connection
                    };


                    /**
                     * @ngdoc event
                     * @name StreamAddClient
                     * @eventOf unchatbar.Stream
                     * @eventType broadcast on root scope
                     * @description
                     *
                     * new single stream added
                     *
                     */
                    $rootScope.$broadcast('StreamAddClient');


                },


                /**
                 * @ngdoc methode
                 * @name removeSingleStreamClose
                 * @methodOf unchatbar.Stream
                 * @param {String} peerId client peerId
                 * @private
                 * @description
                 *
                 * handle single stream close
                 *
                 */
                removeSingleStreamClose: function (peerId) {
                    if (api._stream.stream.single[peerId]) {
                        delete api._stream.stream.single[peerId];
                        /**
                         * @ngdoc event
                         * @name StreamDeleteClient
                         * @eventOf unchatbar.Stream
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * single stream closed
                         *
                         */
                        $rootScope.$broadcast('StreamDeleteClient');
                    }
                },

                /**
                 * @ngdoc methode
                 * @name _addConferenceStream
                 * @methodOf unchatbar.Stream
                 * @param {Object} connection client connection
                 * @param {Object} stream client stream
                 * @private
                 * @description
                 *
                 * handle conference stream start
                 *
                 */
                _addConferenceStream: function (connection, stream) {
                    api._stream.stream.conference[connection.peer] = {
                        stream: stream,
                        option: connection.metadata.streamOption,
                        roomId: connection.metadata.roomId,
                        peerId: connection.peer,
                        call: connection
                    };
                    /**
                     * @ngdoc event
                     * @name StreamAddClientToConference
                     * @eventOf unchatbar.Stream
                     * @eventType broadcast on root scope
                     * @description
                     *
                     * new conference stream added
                     *
                     */
                    $rootScope.$broadcast('StreamAddClientToConference');


                },

                /**
                 * @ngdoc methode
                 * @name removeConferenceStreamClose
                 * @methodOf unchatbar.Stream
                 * @param {String} peerId client peerId
                 * @private
                 * @description
                 *
                 * handle conference stream close
                 *
                 */
                removeConferenceStreamClose: function (peerId) {
                    if (api._stream.stream.conference[peerId]) {
                        delete api._stream.stream.conference[peerId];
                        /**
                         * @ngdoc event
                         * @name StreamDeleteClientToConference
                         * @eventOf unchatbar.Stream
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * conference stream closed
                         *
                         */
                        $rootScope.$broadcast('StreamDeleteClientToConference');
                    }
                }
            };
            return api;
        }
    ]);
