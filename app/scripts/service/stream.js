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
    .service('Stream', ['$rootScope', '$q', 'Broker',
        function ($rootScope, $q, Broker) {


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
                        single : {},
                        conference : {}
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
                    $rootScope.$on('peer:call', function (event, data) {
                        var streamOption = data.client.metadata.streamOption;

                        if (this.getOwnStream(streamOption) !== null) {
                            data.client.answer(this.getOwnStream(streamOption));
                        } else {
                            this._createOwnStream(streamOption).then(function (stream) {
                                data.client.answer(stream);
                            });
                        }
                        this._listenOnClientAnswer(data.client);
                    }.bind(this));
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
                    if (this.getOwnStream(streamOption) === null) {
                        this._createOwnStream(streamOption).then(function (stream) {
                            this._listenOnClientAnswer(Broker.connectStream(peerId, stream, {type:'single', streamOption: streamOption}));
                        }.bind(this));
                    } else {
                        this._listenOnClientAnswer(Broker.connectStream(peerId, this.getOwnStream(streamOption), {type:'single', streamOption: streamOption}));
                    }
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
                callConference : function (peerId, streamOption) {
                    var conferenceUser;
                    if (this.getOwnStream(streamOption) === null) {
                        this._createOwnStream(streamOption).then(function (stream) {
                            conferenceUser = api.getConferenceClientsMap();
                            api._listenOnClientAnswer(Broker.connectStream(peerId, stream, {
                                streamOption: streamOption,
                                type:'conference',
                                conferenceUser : _.keys(conferenceUser)
                            }));
                        });
                    } else {
                        conferenceUser = api.getConferenceClientsMap();
                        this._listenOnClientAnswer(Broker.connectStream(peerId,this.getOwnStream(streamOption),
                            {
                                streamOption: streamOption,
                                type:'conference',
                                conferenceUser : _.keys(conferenceUser)
                            }
                        ));
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
                    _(streamOption).forEach(function(value,key) {storageKey+= key + '_' + value;});
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
                            api._stream.stream.single[this.peer] = {
                                stream: stream,
                                peerId: this.peer,
                                call: this
                            };
                            $rootScope.$apply(function () {
                                $rootScope.$broadcast('stream:add');
                            });
                        } else if (this.metadata.type === 'conference') {
                            var conferenceUser = this.metadata.conferenceUser || [];
                            _.forEach(conferenceUser,function(peerId){
                                if (api.getConferenceClient(peerId) === null) {
                                    api.callConference(peerId);
                                }
                            });
                            api._stream.stream.conference[this.peer] = {
                                stream: stream,
                                peerId: this.peer,
                                call: this
                            };
                            $rootScope.$apply(function () {
                                $rootScope.$broadcast('stream:conferenceUser:add');
                            });
                        }
                    });
                    call.on('close', function () {
                            if (this.metadata.type === 'single') {
                                if (api._stream.stream.single[this.peer]) {
                                    delete api._stream.stream.single[this.peer];
                                    $rootScope.$broadcast('stream:delete');
                                }
                            } else if (this.metadata.type === 'conference') {
                                if (api._stream.stream.conference[this.peer]) {
                                    delete api._stream.stream.conference[this.peer];
                                    $rootScope.$broadcast('stream:conferenceUser:delete');
                                }

                            }

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
                    } else {
                        navigator.getUserMedia(
                            streamOption,
                            function (stream) {
                                var key = this._getOwnStreamKeyByOption(streamOption);
                                this._stream.ownStream[key] = stream;
                                $rootScope.$broadcast('stream:addOwn',{streamOption:streamOption});
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
                }

            };
            return api;
        }
    ]);
