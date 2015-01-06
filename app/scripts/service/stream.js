'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.Stream
 * @require $rootScope
 * @require $q
 * @require Broker

 * @description
 * # peer
 * manage stream connection's
 */
angular.module('unchatbar')
    .service('Stream', ['$rootScope', '$q', 'Broker', 'Profile',
        function ($rootScope, $q, Broker, Profile) {


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
                 * @name init
                 * @methodOf unchatbar.Stream
                 * @description
                 *
                 * init listener
                 *
                 */
                init: function () {
                    $rootScope.$on('BrokerPeerCall', function (event, data) {
                        api._onBrokerCall(data.client, data.client.metadata.streamOption);
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
                _onBrokerCall: function (connection, streamOption) {
                    this._createOwnStream(streamOption).then(function (stream) {
                        connection.answer(stream);
                        api._listenOnClientAnswer(connection);
                    });

                },

                /**
                 * @ngdoc methode
                 * @name _createOwnStream
                 * @methodOf unchatbar.Stream
                 * @params {Object} streamOption audio/video option
                 * @returns {Object} promise
                 * @private
                 * @description
                 *
                 * create own stream
                 *
                 */
                _createOwnStream: function (streamOption) {
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
                                $rootScope.$broadcast('stream:addOwn', {streamOption: streamOption});
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
                    this._createOwnStream(streamOption).then(function (stream) {
                        api._listenOnClientAnswer(Broker.connectStream(peerId, stream,
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
                callConference: function (peerId, streamOption) {
                    this._createOwnStream(streamOption).then(function (stream) {
                        var conferenceUser = api.getConferenceClientsMap();
                        api._listenOnClientAnswer(Broker.connectStream(peerId, stream, {
                            profile: Profile.get(),
                            streamOption: streamOption,
                            type: 'conference',
                            conferenceUser: _.keys(conferenceUser)
                        }));
                    });
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
                 * @name _listenOnClientAnswer
                 * @methodOf unchatbar.Stream
                 * @param {Object} call connection call
                 * @private
                 * @description
                 *
                 * listen to stream event after call
                 *
                 */
                _listenOnClientAnswer: function (call) {
                    call.on('stream', function (stream) {
                        if (this.metadata.type === 'single') {
                            api._onStreamSingle(this, stream);
                        } else if (this.metadata.type === 'conference') {
                            api._onStreamConference(this, stream);
                        }
                    });
                    call.on('close', function () {
                        if (this.metadata.type === 'single') {
                            api._onStreamSingleClose(this.peer);
                        } else if (this.metadata.type === 'conference') {
                            api._onStreamConferenceClose(this.peer);
                        }
                    });
                },

                _onStreamSingle: function (connection, stream) {
                    api._stream.stream.single[connection.peer] = {
                        stream: stream,
                        peerId: connection.peer,
                        call: connection
                    };
                    $rootScope.$apply(function () {
                        /**
                         * @ngdoc event
                         * @name stream:add
                         * @eventOf unchatbar.Stream
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * new single stream added
                         *
                         */
                        $rootScope.$broadcast('stream:add');
                    });
                },
                _onStreamSingleClose : function(peerId) {
                    if (api._stream.stream.single[peerId]) {
                        delete api._stream.stream.single[peerId];
                        /**
                         * @ngdoc event
                         * @name stream:delete
                         * @eventOf unchatbar.Stream
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * single stream closed
                         *
                         */
                        $rootScope.$broadcast('stream:delete');
                    }
                },

                _onStreamConference: function (connection, stream) {
                    var streamOption = connection.metadata.streamOption;
                    var conferenceUser = connection.metadata.conferenceUser || [];
                    _.forEach(conferenceUser, function (peerId) {
                        if (api.getConferenceClient(peerId) === null) {
                            api.callConference(peerId, streamOption);
                        }
                    });
                    api._stream.stream.conference[connection.peer] = {
                        stream: stream,
                        peerId: connection.peer,
                        call: connection
                    };
                    $rootScope.$apply(function () {
                        /**
                         * @ngdoc event
                         * @name stream:conferenceUser:add
                         * @eventOf unchatbar.Stream
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * new conference stream added
                         *
                         */
                        $rootScope.$broadcast('stream:conferenceUser:add');
                    });
                },

                _onStreamConferenceClose : function (peerId) {
                    if (api._stream.stream.conference[peerId]) {
                        delete api._stream.stream.conference[peerId];
                        /**
                         * @ngdoc event
                         * @name stream:conferenceUser:delete
                         * @eventOf unchatbar.Stream
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * conference stream closed
                         *
                         */
                        $rootScope.$broadcast('stream:conferenceUser:delete');
                    }
                }


            };
            return api;
        }
    ]);
