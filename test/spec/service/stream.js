'use strict';

describe('Serivce: Profile', function () {
    var rootScope, BrokerService, StreamService;
    beforeEach(module('unchatbar'));


    beforeEach(inject(function ($rootScope, Broker, Stream) {
        rootScope = $rootScope;
        StreamService = Stream;
        BrokerService = Broker;
    }));

    describe('check methode', function () {

        describe('init', function () {
            var callObject;
            beforeEach(function () {
                StreamService.init();
                callObject = {
                    answer: function () {
                    }
                };
            });

            describe('check listener `peer:call`', function () {
                beforeEach(function () {
                    spyOn(StreamService, '_listenOnClientAnswer').and.returnValue(true);
                });
                describe('has own Data stream', function () {
                    beforeEach(function () {
                        StreamService.init();
                        spyOn(StreamService, 'getOwnStream').and.returnValue('stream');
                    });
                    it('should call `Stream.getOwnStream` with peerId ,action `profile` and userprofile', function () {
                        var callObject = {
                            answer: function () {
                            }
                        };
                        spyOn(callObject, 'answer').and.returnValue(true);
                        rootScope.$broadcast('peer:call', {client: callObject});

                        expect(callObject.answer).toHaveBeenCalledWith('stream');
                    });

                    it('should call `Stream._listenOnClientAnswer` with peerId ,action `profile` and userprofile', function () {
                        spyOn(callObject, 'answer').and.returnValue(true);
                        rootScope.$broadcast('peer:call', {client: callObject});
                        rootScope.$apply();

                        expect(StreamService._listenOnClientAnswer).toHaveBeenCalledWith({answer: jasmine.any(Function)});
                    });
                });

                describe('has not own Data stream', function () {
                    beforeEach(inject(function ($q) {
                        StreamService.init();

                        spyOn(StreamService, 'getOwnStream').and.returnValue(null);
                        spyOn(StreamService, '_createOwnStream').and.callFake(function () {
                            var defer = $q.defer();
                            defer.resolve('stream');
                            return defer.promise;
                        });
                        callObject = {
                            answer: function () {
                            }
                        };
                    }));

                    it('should call `Stream._listenOnClientAnswer` with peerId ,action `profile` and userprofile', function () {
                        spyOn(callObject, 'answer').and.returnValue(true);
                        rootScope.$broadcast('peer:call', {client: callObject});
                        rootScope.$apply();

                        expect(callObject.answer).toHaveBeenCalledWith('stream');
                    });

                    it('should call `Stream._listenOnClientAnswer` with peerId ,action `profile` and userprofile', function () {
                        spyOn(callObject, 'answer').and.returnValue(true);
                        rootScope.$broadcast('peer:call', {client: callObject});
                        rootScope.$apply();

                        expect(StreamService._listenOnClientAnswer).toHaveBeenCalledWith({answer: jasmine.any(Function)});
                    });
                });

            });
        });

        describe('callUser', function () {
            beforeEach(function () {
                spyOn(StreamService, '_listenOnClientAnswer').and.returnValue(true);
                spyOn(BrokerService, 'connectStream').and.returnValue('streamCall');
            });
            describe('has own stream', function () {
                beforeEach(function () {
                    spyOn(StreamService, 'getOwnStream').and.returnValue('stream');
                    StreamService.callUser('peerId');
                });
                it('should call `Broker.connectStream` with peerId and stream', function () {
                    expect(BrokerService.connectStream).toHaveBeenCalledWith('peerId', 'stream');
                });
                it('should call `Stream._listenOnClientAnswer', function () {
                    expect(StreamService._listenOnClientAnswer).toHaveBeenCalledWith('streamCall');
                });
            });

            describe('has no own stream', function () {
                beforeEach(inject(function ($q) {
                    spyOn(StreamService, 'getOwnStream').and.returnValue(null);
                    spyOn(StreamService, '_createOwnStream').and.callFake(function () {
                        var defer = $q.defer();
                        defer.resolve('stream');
                        return defer.promise;
                    });
                    StreamService.callUser('peerId');
                    rootScope.$apply();
                }));
                it('should call `Broker.connectStream` with peerId and stream', function () {
                    expect(BrokerService.connectStream).toHaveBeenCalledWith('peerId', 'stream');
                });
                it('should call `Stream._listenOnClientAnswer', function () {
                    expect(StreamService._listenOnClientAnswer).toHaveBeenCalledWith('streamCall');
                });
            });
        });

        describe('getOwnStream', function () {
            it('should return value from `Stream._stream.ownStream`' , function(){
                StreamService._stream.ownStream = 'testValue';
                expect(StreamService.getOwnStream()).toBe('testValue');
            });
        });

        describe('getClientStream', function () {
            it('should return value from `Stream._stream.stream[streamId]`' , function(){
                StreamService._stream.stream = {test : 'testValue' , nextKey: 'XX'};
                expect(StreamService.getClientStream('test')).toBe('testValue');
            });
        });

        describe('getClientStreamMap', function () {
            it('should return value from `Stream._stream.stream`' , function(){
                StreamService._stream.stream = 'streamMap';
                expect(StreamService.getClientStreamMap()).toBe('streamMap');
            });
        });

        describe('_listenOnClientAnswer' , function(){
            it('should call param `call` with `stream`' , function(){
                var call = {on : function () {}};
                spyOn(call,'on').and.returnValue(true);
                StreamService._listenOnClientAnswer(call);

                expect(call.on).toHaveBeenCalledWith('stream',jasmine.any(Function));
            });
            describe('trigger on stream event' , function(){
               var streamEventTrigger;
                beforeEach(function(){
                   streamEventTrigger = function(){}
                   var call = {on : function (event,callback) {
                       streamEventTrigger = callback;
                   }};
                   StreamService._listenOnClientAnswer(call);

               });
                it('should set stream to `Stream._stream.stream`' , function() {
                    StreamService._stream.stream = {};

                    streamEventTrigger({id:'StreamId',data : 'test'});

                    expect(StreamService._stream.stream).toEqual({StreamId:{id:'StreamId',data : 'test'} });
                });

                it('should broatcast `stream:add`' , function() {
                    StreamService._stream.stream = {};
                    spyOn(rootScope,'$broadcast').and.returnValue(true);
                    streamEventTrigger({id:'StreamId',data : 'test'});

                    expect(rootScope.$broadcast).toHaveBeenCalledWith('stream:add');
                });
            });
        });

        describe('_createOwnStream' , function(){
            describe('userMedia api is not available' , function() {
                beforeEach(function() {
                    spyOn(StreamService,'_getUserMediaApi').and.returnValue(0);
                });
                it('should reject an error' , function(){
                    StreamService._createOwnStream().then(function(){

                    }).catch(function(error){
                        expect(error).toBe('no media api');
                    });
                    rootScope.$apply();
                });
            });
            describe('userMedia api is available' , function() {

                var userMediaSuccess, userMediaError,
                    fakeUserMedia = {api :  function(option,onSuccess,onError){
                        userMediaSuccess = onSuccess;
                        userMediaError = onError;
                    }};
                beforeEach(function() {
                    spyOn(fakeUserMedia,'api').and.callThrough();
                    spyOn(StreamService,'_getUserMediaApi').and.returnValue(fakeUserMedia.api);

                });
                it('should call api with audi/video option an success/error Methode' , function(){
                    StreamService._createOwnStream();
                    rootScope.$apply();
                    expect(fakeUserMedia.api).toHaveBeenCalledWith(
                        { video: true, audio: true },
                        jasmine.any(Function),
                        jasmine.any(Function)
                        );
                });
                describe('userMedia return error' , function() {
                    it('should reject error' , function(){
                        userMediaError('MediaError');

                        StreamService._createOwnStream()
                            .then(function(){

                            })
                            .catch(function(err){
                                expect(err).toBe('MediaError');
                            });

                        rootScope.$apply();
                    });
                });
                describe('userMedia was successfull' , function() {
                    beforeEach(function(){
                        userMediaSuccess('stream');
                    });

                    it('should set stream to `Stream._stream.ownStream`', function () {
                        StreamService._stream.ownStream = '';
                        StreamService._createOwnStream()
                            .then(function () {
                                expect(StreamService._stream.ownStream).toBe('stream');
                            });
                        rootScope.$apply();
                    });

                    it('should broadcast `stream:add`', function () {
                        spyOn(rootScope,'$broadcast').and.returnValue(true);
                        StreamService._stream.ownStream = '';
                        StreamService._createOwnStream()
                            .then(function () {
                                expect(rootScope.$broadcast).toHaveBeenCalledWith('stream:add');
                            });
                        rootScope.$apply();
                    });

                    it('should return stream', function () {
                        spyOn(rootScope,'$broadcast').and.returnValue(true);
                        StreamService._stream.ownStream = '';
                        StreamService._createOwnStream()
                            .then(function (stream) {
                                expect(stream).toHaveBeenCalledWith('stream');
                            });
                        rootScope.$apply();
                    });
                });
            });
        });
    });
});