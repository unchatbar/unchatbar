'use strict';

describe('Serivce: Profile', function () {
    var rootScope, BrokerService, StreamService, ProfileService, ConnectionService;
    beforeEach(module('unchatbar'));


    beforeEach(inject(function ($rootScope, Broker, Stream, Profile, Connection) {
        rootScope = $rootScope;
        StreamService = Stream;
        ConnectionService = Connection;
        BrokerService = Broker;
        ProfileService = Profile;
        ProfileService = Profile;
    }));

    describe('check methode', function () {

        describe('init', function () {
            var callObject;
            beforeEach(function () {
                StreamService.init();
                callObject = {
                    metadata: {streamOption: 'streamOption'},
                    answer: function () {
                    }
                };
            });
            it('should call `Stream.answerCall` with connection and streamOption after broadcast `BrokerPeerCall`', function () {
                spyOn(StreamService, 'addCallToAnswer').and.returnValue(true);
                rootScope.$broadcast('BrokerPeerCall', {client: callObject});
                expect(StreamService.addCallToAnswer).toHaveBeenCalledWith(callObject);
            });

            it('should call `Stream.answerCall` with peerId and users after broadcast `ConnectionGetMessageupdateStreamGroup`', function () {
                spyOn(StreamService, '_callToGroupUsersFromClient').and.returnValue(true);
                rootScope.$broadcast('ConnectionGetMessageupdateStreamGroup', {
                    peerId: 'peerId',
                    message: {
                        users: ['UserA', 'UserB']
                    }
                });
                expect(StreamService._callToGroupUsersFromClient).toHaveBeenCalledWith('peerId', ['UserA', 'UserB']);
            });
        });
        describe('getCallsForAnswerMap', function () {
            it('should return `Stream._callForWaitingAnswer`' , function(){
               StreamService._callForWaitingAnswer = ['call'];
               expect(StreamService.getCallsForAnswerMap()).toEqual(['call']);
            });
        });
        describe('addCallToAnswer', function () {
            it('should push connection to `Stream._callForWaitingAnswer`' , function(){
                StreamService._callForWaitingAnswer = {};
                StreamService.addCallToAnswer({peer: 'peerId',connection : 'data'});
                expect(StreamService._callForWaitingAnswer).toEqual({peerId : {peer: 'peerId',connection : 'data'}});
            });
            it('should broadcast on rootScope `StreamCall`' , function(){
                spyOn(rootScope,'$broadcast').and.returnValue(true);
                StreamService.addCallToAnswer('connection');
                expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamAddClient');
            });
        });
        describe('answerCall', function () {
            var connection;
            beforeEach(inject(function ($q) {
                spyOn(StreamService, '_createOwnStream').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve('stream');
                    return defer.promise;
                });
                connection = {
                    answer: function () {
                    }
                };
                spyOn(StreamService, '_listenOnClientStreamConnection').and.returnValue(true);

            }));


            it('should call Stream._createOwnStream with streamOption', function () {
                StreamService.answerCall(connection, 'streamOption');

                expect(StreamService._createOwnStream).toHaveBeenCalledWith('streamOption');
            });

            it('should call connection.answer with stream', function () {
                spyOn(connection, 'answer').and.returnValue(true);
                StreamService.answerCall(connection, 'streamOption');
                rootScope.$apply();
                expect(connection.answer).toHaveBeenCalledWith('stream');
            });

            it('should call Stream._listenOnClientStreamConnection with connection', function () {
                StreamService.answerCall(connection, 'streamOption');
                rootScope.$apply();
                expect(StreamService._listenOnClientStreamConnection).toHaveBeenCalledWith(connection);
            });
        });

        describe('callUser', function () {
            beforeEach(function () {
                spyOn(StreamService, '_listenOnClientStreamConnection').and.returnValue(true);
                spyOn(BrokerService, 'connectStream').and.returnValue('streamCall');
                spyOn(ProfileService, 'get').and.returnValue('userProfile');

            });
            beforeEach(inject(function ($q) {
                spyOn(StreamService, '_createOwnStream').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve('stream');
                    return defer.promise;
                });
                StreamService.callUser('peerId', 'streamOption');
                rootScope.$apply();
            }));
            it('should call `Broker.connectStream` with peerId and stream', function () {
                expect(BrokerService.connectStream).toHaveBeenCalledWith('peerId', 'stream', {
                    profile: 'userProfile',
                    type: 'single',
                    streamOption: 'streamOption'
                });
            });
            it('should call `Stream._listenOnClientStreamConnection', function () {
                expect(StreamService._listenOnClientStreamConnection).toHaveBeenCalledWith('streamCall');
            });

        });

        describe('callConference', function () {
            beforeEach(inject(function ($q) {
                spyOn(StreamService, '_listenOnClientStreamConnection').and.returnValue(true);
                spyOn(BrokerService, 'connectStream').and.returnValue('streamCall');
                spyOn(ProfileService, 'get').and.returnValue('userProfile');
                spyOn(StreamService, '_createOwnStream').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve('stream');
                    return defer.promise;
                });
            }));
            it('should not call `Stream.callConference` when stream exits', function () {
                spyOn(StreamService, 'getConferenceClient').and.returnValue('data');
                spyOn(BrokerService, 'getPeerId').and.returnValue('otherPeerId');

                StreamService.callConference('roomId', 'peerId', 'streamOption');

                rootScope.$apply();

                expect(StreamService._createOwnStream).not.toHaveBeenCalled();
            });

            it('should not call `Stream.callConference` and stream peer is own peed id', function () {
                spyOn(StreamService, 'getConferenceClient').and.returnValue(null);
                spyOn(BrokerService, 'getPeerId').and.returnValue('peerId');
                StreamService.callConference('roomId', 'peerId', 'streamOption');

                rootScope.$apply();

                expect(StreamService._createOwnStream).not.toHaveBeenCalled();
            });

            it('should call `Broker.connectStream` with peerId and stream', function () {
                spyOn(StreamService, 'getConferenceClient').and.returnValue(null);
                StreamService.callConference('roomId', 'peerId', 'streamOption');

                rootScope.$apply();

                expect(BrokerService.connectStream).toHaveBeenCalledWith('peerId', 'stream',
                    {
                        profile: 'userProfile',
                        roomId: 'roomId',
                        streamOption: 'streamOption',
                        type: 'conference'


                    });
            });
            it('should call `Stream._listenOnClientStreamConnection', function () {
                StreamService.callConference('roomId', 'peerId', 'streamOption');

                rootScope.$apply();

                expect(StreamService._listenOnClientStreamConnection).toHaveBeenCalledWith('streamCall');
            });

        });

        describe('getOwnStream', function () {
            beforeEach(function () {
                spyOn(StreamService, '_getOwnStreamKeyByOption').and.returnValue('storageKey');
            });
            it('should call `Stream._getOwnStreamKeyByOption`', function () {
                StreamService.getOwnStream('streamOption');
                expect(StreamService._getOwnStreamKeyByOption).toHaveBeenCalledWith('streamOption');
            });
            it('should return value from `Stream._stream.ownStream`', function () {
                StreamService._stream.ownStream = {
                    storageKey: 'testValue'
                };
                expect(StreamService.getOwnStream('streamOption')).toBe('testValue');
            });
        });

        describe('getClientStream', function () {
            it('should return value from `Stream._stream.stream[streamId]`', function () {
                StreamService._stream.stream.single = {test: 'testValue', nextKey: 'XX'};
                expect(StreamService.getClientStream('test')).toBe('testValue');
            });
        });

        describe('getClientStreamMap', function () {
            it('should return value from `Stream._stream.stream`', function () {
                StreamService._stream.stream.single = 'streamMap';
                expect(StreamService.getClientStreamMap()).toBe('streamMap');
            });
        });

        describe('closeAllOwnMedia', function () {
            var stream;
            beforeEach(function () {
                stream = {
                    stop: function () {
                    }
                };
                StreamService._stream.ownStream = {own: stream};
                spyOn(stream, 'stop').and.returnValue(true);
                spyOn(rootScope, '$broadcast').and.returnValue(true);
            });
            it('should call `stop` for all own stream', function () {
                StreamService.closeAllOwnMedia();

                expect(stream.stop).toHaveBeenCalled();
            });

            it('should remove stream from storage', function () {
                StreamService.closeAllOwnMedia();

                expect(StreamService._stream.ownStream).toEqual({});
            });

            it('should broadcast `StreamCloseOwn` on rootscope', function () {
                StreamService.closeAllOwnMedia();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamCloseOwn', {});
            });
        });

        describe('getConferenceClientsMap', function () {
            it('should return value from `Stream._stream.stream.conference`', function () {
                StreamService._stream.stream.conference = 'streamMap';
                expect(StreamService.getConferenceClientsMap()).toBe('streamMap');
            });
        });

        describe('_listenOnClientStreamConnection', function () {
            var streamEventTrigger = {peer: 'peerId', metadata: {}}, call;
            beforeEach(function () {
                spyOn(StreamService, '_addEmptyStreamCall').and.returnValue(true);
                streamEventTrigger = {peer: 'peerId', metadata: {}};
                call = {
                    on: function (event, callback) {
                        streamEventTrigger[event] = callback;
                    }
                };
            });

            it('should call `Stream._addCall` with call object', function () {
                StreamService._listenOnClientStreamConnection(call);

                expect(StreamService._addEmptyStreamCall).toHaveBeenCalledWith(call);
            });

            it('should call param `call` with `stream`', function () {
                spyOn(call, 'on').and.returnValue(true);

                StreamService._listenOnClientStreamConnection(call);

                expect(call.on).toHaveBeenCalledWith('stream', jasmine.any(Function));
            });

            it('should call param `close` with `stream`', function () {
                spyOn(call, 'on').and.returnValue(true);

                StreamService._listenOnClientStreamConnection(call);

                expect(call.on).toHaveBeenCalledWith('close', jasmine.any(Function));
            });

            describe('trigger event stream', function () {
                beforeEach(function () {
                    spyOn(StreamService, '_addSingleStream').and.returnValue(true);
                    spyOn(StreamService, '_addConferenceStream').and.returnValue(true);
                    spyOn(StreamService, '_sendOwnUserFromConference').and.returnValue(true);

                    StreamService._listenOnClientStreamConnection(call);
                });
                describe('connection exits in call list', function () {
                    beforeEach(function () {
                        spyOn(StreamService, 'getClientStream').and.returnValue(true);
                        spyOn(StreamService, 'getConferenceClient').and.returnValue(true);
                    });

                    it('should call `Stream._addSingleStream` with connection object and stream', function () {
                        streamEventTrigger.metadata = {
                            type: 'single'
                        };
                        streamEventTrigger.stream('stream');
                        expect(StreamService._addSingleStream).toHaveBeenCalledWith(streamEventTrigger, 'stream');
                    });
                    it('should call `Stream._addConferenceStream` with connection object and stream', function () {
                        streamEventTrigger.metadata = {
                            type: 'conference'
                        };
                        streamEventTrigger.stream('stream');
                        expect(StreamService._addConferenceStream).toHaveBeenCalledWith(streamEventTrigger, 'stream');
                    });

                    it('should call `Stream._sendOwnUserFromConference` with client peer id', function () {
                        streamEventTrigger.metadata = {
                            type: 'conference'
                        };
                        streamEventTrigger.stream('stream');
                        expect(StreamService._sendOwnUserFromConference).toHaveBeenCalledWith('peerId');
                    });
                });
                describe('connection not exits in call list', function () {
                    beforeEach(function () {
                        streamEventTrigger.close = function () {
                        };
                        spyOn(StreamService, 'getClientStream').and.returnValue(false);
                        spyOn(streamEventTrigger, 'close').and.returnValue(true);

                    });
                    it('should call `Stream.close` for single', function () {
                        streamEventTrigger.metadata = {
                            type: 'single'
                        };
                        streamEventTrigger.stream('stream');
                        expect(streamEventTrigger.close).toHaveBeenCalled();
                    });

                    it('should call `Stream.close` for conference', function () {
                        streamEventTrigger.metadata = {
                            type: 'conference'
                        };

                        streamEventTrigger.stream('stream');
                        expect(streamEventTrigger.close).toHaveBeenCalled();
                    });
                });
            });

            describe('trigger event close', function () {
                beforeEach(function () {
                    spyOn(StreamService, 'removeSingleStreamClose').and.returnValue(true);
                    spyOn(StreamService, 'removeConferenceStreamClose').and.returnValue(true);
                    StreamService._listenOnClientStreamConnection(call);
                    streamEventTrigger.peerId = 'peerId';
                });
                it('should call `Stream._addSingleStream` with peerId', function () {
                    streamEventTrigger.metadata = {
                        type: 'single'
                    };

                    streamEventTrigger.close();

                    expect(StreamService.removeSingleStreamClose).toHaveBeenCalledWith('peerId');
                });
                it('should call `Stream._addConferenceStream` with peerId', function () {
                    streamEventTrigger.metadata = {
                        type: 'conference'
                    };

                    streamEventTrigger.close();

                    expect(StreamService.removeConferenceStreamClose).toHaveBeenCalledWith('peerId');
                });
            });
        });

        describe('_sendOwnUserFromConference', function () {

            it('should call `Connection.send`', function () {
                spyOn(ConnectionService, 'send').and.returnValue(true);
                spyOn(StreamService, 'getConferenceClientsMap').and.returnValue({userA: 'data', UserB: 'data'});

                StreamService._sendOwnUserFromConference('peerId');

                expect(ConnectionService.send).toHaveBeenCalledWith('peerId',
                    {
                        action: 'updateStreamGroup',
                        users: ['userA', 'UserB']
                    });
            });
        });

        describe('_callToGroupUsersFromClient', function () {
            var users;
            beforeEach(function () {
                spyOn(StreamService, 'callConference').and.returnValue(true);
                spyOn(StreamService, 'getConferenceClient').and.callFake(function (peerId) {
                    return users[peerId] || null;
                });
            });
            describe('user is not in conference List', function () {
                it('should not call `Stream.callConference`', function () {
                    users = {};
                    StreamService._callToGroupUsersFromClient('peerId', ['userA', 'UserB']);

                    expect(StreamService.callConference).not.toHaveBeenCalled();
                });
            });

            describe('user is in conference List', function () {
                it('should call `Stream.callConference` and stream peer is not own peed id', function () {
                    spyOn(BrokerService, 'getPeerId').and.returnValue('userC');
                    users = {
                        'peerId': {roomId: 'roomId', option: 'Streamoption'},
                        'userA': {option: 'streamOptionA'}
                    };
                    StreamService._callToGroupUsersFromClient('peerId', ['userA', 'UserB']);

                    expect(StreamService.callConference).toHaveBeenCalledWith('roomId', 'UserB', 'Streamoption');
                });


            });
        });

        describe('removeSingleStreamClose', function () {
            it('should remove stream from `Stream._stream.stream`', function () {
                StreamService._stream.stream.single = {
                    'peerId': 'stream'
                };
                StreamService.removeSingleStreamClose('peerId');

                expect(StreamService._stream.stream.single).toEqual({});

            });

            it('should broadcast `StreamDeleteClient`', function () {
                StreamService._stream.stream.single = {
                    'peerId': 'stream'
                };

                spyOn(rootScope, '$broadcast').and.returnValue(true);

                StreamService.removeSingleStreamClose('peerId');


                expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamDeleteClient');
            });
        });

        describe('removeConferenceStreamClose', function () {
            it('should remove stream from `Stream._stream.stream`', function () {
                StreamService._stream.stream.conference = {
                    'peerId': 'stream'
                };
                StreamService.removeConferenceStreamClose('peerId');

                expect(StreamService._stream.stream.conference).toEqual({});

            });

            it('should broadcast `StreamDeleteClientToConference`', function () {
                StreamService._stream.stream.conference = {
                    'peerId': 'stream'
                };
                spyOn(rootScope, '$broadcast').and.returnValue(true);

                StreamService.removeConferenceStreamClose('peerId');

                expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamDeleteClientToConference');
            });
        });

        describe('_addConferenceStream', function () {
            beforeEach(function () {
                spyOn(StreamService, 'callConference').and.returnValue(true);
                spyOn(StreamService, 'getOwnStream').and.returnValue('stream');

            });


            it('should set stream to `Stream._stream.stream`', function () {
                spyOn(StreamService, 'getConferenceClient').and.returnValue('connection');
                var connection = {
                    peer: 'peerId',
                    data: 'test',
                    metadata: {
                        roomId: 'roomId',
                        streamOption: 'streamOption'

                    }
                };
                StreamService._addConferenceStream(connection, 'stream');

                expect(StreamService._stream.stream.conference).toEqual({
                    peerId: {
                        stream: 'stream',
                        option: 'streamOption',
                        roomId: 'roomId',
                        peerId: 'peerId',
                        call: connection
                    }
                });
            });

            it('should broadcast `StreamAddClientToConference`', function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                spyOn(StreamService, 'getConferenceClient').and.returnValue('connection');
                var connection = {
                    peer: 'peerId',
                    data: 'test',
                    metadata: {
                        streamOption: 'streamOption'

                    }
                };
                StreamService._addConferenceStream(connection, 'stream');

                expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamAddClientToConference');
            });
        });

        describe('_addSingleStream', function () {
            it('should set stream to `Stream._stream.stream`', function () {
                StreamService._stream.stream.single = {};

                StreamService._addSingleStream({peer: 'peerId', data: 'test'}, 'stream');

                expect(StreamService._stream.stream.single).toEqual({
                    peerId: {
                        stream: 'stream',
                        peerId: 'peerId',
                        call: {peer: 'peerId', data: 'test'}
                    }
                });
            });

            it('should broadcast `StreamAddClient`', function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);

                StreamService._addSingleStream({peer: 'peerId', data: 'test'}, 'stream');

                expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamAddClient');
            });
        });

        describe('_createOwnStream', function () {
            describe('userMedia api is not available', function () {
                beforeEach(function () {
                    spyOn(StreamService, '_getUserMediaApi').and.returnValue(0);
                });
                it('should reject an error', function () {
                    StreamService._createOwnStream().then(function () {

                    }).catch(function (error) {
                        expect(error).toBe('no media api');
                    });
                    rootScope.$apply();
                });
            });
            describe('use stream from cache', function () {
                it('should return cache stream', function () {
                    var streamFromCache = '';
                    spyOn(StreamService, 'getOwnStream').and.returnValue('cacheStream');
                    spyOn(StreamService, '_getUserMediaApi').and.returnValue(true);
                    StreamService._createOwnStream('streamOption').then(function (stream) {
                        streamFromCache = stream;
                    });
                    rootScope.$apply();
                    expect(streamFromCache).toBe('cacheStream');
                });

            });
            describe('userMedia api is available', function () {

                var userMediaSuccess, userMediaError,
                    fakeUserMedia = {
                        api: function (option, onSuccess, onError) {
                            userMediaSuccess = onSuccess;
                            userMediaError = onError;
                        }
                    };
                beforeEach(function () {
                    spyOn(StreamService, 'getOwnStream').and.returnValue(null);
                    spyOn(fakeUserMedia, 'api').and.callThrough();
                    spyOn(StreamService, '_getUserMediaApi').and.returnValue(fakeUserMedia.api);

                });
                it('should call api with audi/video option an success/error Methode', function () {
                    StreamService._createOwnStream('streamOption');
                    rootScope.$apply();
                    expect(fakeUserMedia.api).toHaveBeenCalledWith(
                        'streamOption',
                        jasmine.any(Function),
                        jasmine.any(Function)
                    );
                });
                describe('userMedia return error', function () {
                    it('should reject error', function () {
                        var error = '';
                        StreamService._createOwnStream()
                            .then(function () {

                            })
                            .catch(function (err) {
                                error = err;
                            });
                        userMediaError('MediaError');
                        rootScope.$apply();
                        expect(error).toBe('MediaError');
                    });
                });
                describe('userMedia was successfull', function () {
                    var streamReturn = {};
                    beforeEach(function () {
                        spyOn(StreamService, '_getOwnStreamKeyByOption').and.returnValue('storageKey');
                        spyOn(rootScope, '$broadcast').and.returnValue(true);
                        StreamService._stream.ownStream = {};
                        StreamService._createOwnStream('streamOption').then(function (stream) {
                            streamReturn = stream;
                        });

                    });

                    it('should set stream to `Stream._stream.ownStream`', function () {
                        userMediaSuccess('stream');

                        expect(StreamService._stream.ownStream).toEqual({storageKey: 'stream'});
                    });
                    it('should call `Stream._getOwnStreamKeyByOption`', function () {
                        userMediaSuccess('stream');

                        expect(StreamService._getOwnStreamKeyByOption).toHaveBeenCalledWith('streamOption');

                    });
                    it('should broadcast `StreamAddClient`', function () {
                        userMediaSuccess('stream');

                        expect(rootScope.$broadcast).toHaveBeenCalledWith('StreamAddOwn', {streamOption: 'streamOption'});
                    });

                    it('should return stream', function () {
                        userMediaSuccess('stream');

                        rootScope.$apply();

                        expect(streamReturn).toBe('stream');
                    });
                });
            });
        });

        describe('_getOwnStreamKeyByOption', function () {
            it('should return all key as string from object', function () {
                expect(StreamService._getOwnStreamKeyByOption({
                    test: 'value',
                    testX: 'value2'
                })).toBe('test_valuetestX_value2');
            });
        });
    });
});