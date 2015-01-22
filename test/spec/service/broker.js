'use strict';

describe('Serivce: Broker', function () {
    var brokerService, brokerProvider, peerService, rootScope;
    beforeEach(module('unchatbar', ['BrokerProvider', function (_brokerProvider) {
        brokerProvider = _brokerProvider;
        brokerProvider.setHost('host.de');
        brokerProvider.setPort(12345);
        brokerProvider.setPath('test/');

    }]));


    beforeEach(inject(function (Broker, Peer, $rootScope) {
        rootScope = $rootScope;
        brokerService = Broker;
        peerService = Peer;

    }));

    describe('check methode', function () {

        describe('setPeerId', function () {
            it('should set `Broker._storage.peerId` with peerId', function () {
                brokerService.setPeerId('testPeerId');
                expect(brokerService._storage.peerId).toBe('testPeerId');
            });
        });

        describe('getPeerIdFromStorage', function () {
            it('should return peerId from `Broker._storage.peerId`', function () {
                brokerService._storage.peerId = 'testPeerId';
                expect(brokerService.getPeerIdFromStorage()).toBe('testPeerId');
            });
        });
        describe('init', function () {
            it('should call `Broker._initStorage`', function () {
                spyOn(brokerService, '_initStorage').and.returnValue(true);

                brokerService.init();

                expect(brokerService._initStorage).toHaveBeenCalled();
            });


        });
        describe('_initStorage', function () {
            var sessionStorage = {};
            beforeEach(inject(function ($sessionStorage) {
                sessionStorage = $sessionStorage;
                spyOn(sessionStorage, '$default').and.returnValue({broker: {test: 'data'}});
                brokerService._initStorage();
            }));
            it('should call `$sessionStorage.$default` with object', function () {
                expect(sessionStorage.$default).toHaveBeenCalledWith({
                    broker: {
                        peerId: ''
                    }
                });
            });
            it('should set  `brokerService._storage` return value from `$sessionStorage.$default`', function () {
                expect(brokerService._storage).toEqual({test: 'data'});
            });
        });
        describe('_getWebWorker' , function(){
            beforeEach(function () {
                spyOn(window, 'Worker').and.callFake(function () {
                    return {'Worker': 'test'};
                });
            });
            it('should call `window.Worker` with broker-worker.js', function () {
                brokerService._getWebWorker();

                expect(window.Worker).toHaveBeenCalledWith('scripts/worker/broker-worker.js');
            });
            it('should set return of `window.Worker` to `Broker._brokerWorker`', function () {
                expect(brokerService._getWebWorker()).toEqual({'Worker': 'test'});
            });

        });
        describe('_holdBrokerConnection', function () {
            var addEventListenerCallback = function () {
                },
                postMessageCallback = function () {
                },
                webWorker;

            describe('check worker', function () {
                beforeEach(function () {
                    webWorker = {
                        addEventListener: function () {
                        },
                        postMessage: function () {
                        },
                        terminate : function(){}
                    };
                    spyOn(brokerService,'_getWebWorker').and.returnValue(webWorker);

                    spyOn(webWorker, 'addEventListener').and.callFake(function (eventName, callback) {
                        addEventListenerCallback = callback;
                    });
                    spyOn(webWorker, 'postMessage').and.callFake(function (eventName, callback) {
                        postMessageCallback = callback;
                    });
                    spyOn(webWorker, 'terminate').and.returnValue(true);

                    brokerService._holdBrokerConnection();
                });


                it('should call `this._brokerWorker.addEventListener` with `message`', function () {
                    expect(webWorker.addEventListener)
                        .toHaveBeenCalledWith('message', addEventListenerCallback, false);
                });
                it('should call `this._brokerWorker.postMessage` with `HEARTBEAT`', function () {
                    expect(webWorker.postMessage).toHaveBeenCalledWith('HEARTBEAT');
                });
                describe('trigger addEventListener', function () {
                    var peerSocket = {};
                    beforeEach(function () {
                        peerSocket = {
                            socket: {
                                _wsOpen: function () {
                                },
                                send: function () {
                                },

                            },
                            destroy : function(){

                            }
                        };
                        spyOn(brokerService, 'connectServer').and.returnValue(false);
                        spyOn(peerService, 'get').and.returnValue(peerSocket);
                        spyOn(peerSocket.socket, 'send').and.returnValue(true);
                        spyOn(peerSocket, 'destroy').and.returnValue(true);


                    });
                    describe('browser is offline', function () {
                        beforeEach(function () {
                            spyOn(brokerService, '_isBrowserOnline').and.returnValue(false);
                            addEventListenerCallback();
                        });
                        it('should not call `peerService.get().socket.send` with type `HEARTBEAT`', function () {
                            expect(peerSocket.socket.send).not.toHaveBeenCalled();
                        });
                        it('should not call `webWorker.terminate()', function () {
                            expect(webWorker.terminate).not.toHaveBeenCalled();
                        });

                        it('should not call `Broker.connectServer', function () {
                            expect(brokerService.connectServer).not.toHaveBeenCalled();
                        });
                    });
                    describe('browser is online', function () {
                        beforeEach(function () {
                            spyOn(brokerService, '_isBrowserOnline').and.returnValue(true);
                        });

                        describe('socket is open', function () {
                            beforeEach(function () {
                                spyOn(peerSocket.socket, '_wsOpen').and.returnValue(true);
                                addEventListenerCallback();
                            });
                            it('should call `peerService.get().socket.send` with type `HEARTBEAT`', function () {
                                expect(peerSocket.socket.send).toHaveBeenCalledWith({type: 'HEARTBEAT'});
                            });

                            it('should not call `Broker.connectServer', function () {
                                expect(brokerService.connectServer).not.toHaveBeenCalled();
                            });
                        });
                        describe('socket is closed', function () {
                            beforeEach(function () {
                                spyOn(peerSocket.socket, '_wsOpen').and.returnValue(false);
                                addEventListenerCallback();
                            });
                            it('should not call `peerService.get().socket.send` with type `HEARTBEAT`', function () {
                                expect(peerSocket.destroy).toHaveBeenCalled();
                            });
                            it('should not call `peerService.get().socket.send` with type `HEARTBEAT`', function () {
                                expect(peerSocket.socket.send).not.toHaveBeenCalled();
                            });
                            it('should not call `webWorker.terminate()', function () {
                                expect(webWorker.terminate).toHaveBeenCalled();
                            });
                            it('should call `Broker.connectServer', function () {
                                expect(brokerService.connectServer).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });

        });

        describe('connectServer', function () {
            beforeEach(function () {

                spyOn(peerService, 'init').and.returnValue('peer');
                spyOn(brokerService, '_peerListener').and.returnValue(true);
                spyOn(brokerService, '_holdBrokerConnection').and.returnValue(true);
            });

            it('should call Peer.init with peerId and provider options', function () {
                brokerService._storage.peerId = 'peerTest';
                brokerService.connectServer();

                expect(peerService.init).toHaveBeenCalledWith('peerTest', {
                    host: 'host.de',
                    secure:true,
                    port: 12345,
                    path: 'test/'
                });
            });
            it('should call _peerListener', function () {
                brokerService.connectServer();

                expect(brokerService._peerListener).toHaveBeenCalled();
            });


            it('should call `Broker._holdBrokerConnection` ', function () {
                brokerService.connectServer();

                expect(brokerService._holdBrokerConnection).toHaveBeenCalled();
            });
        });

        describe('_peerListener', function () {
            var peer = {}, peerCallBack = {}, rootScope;
            beforeEach(inject(function ($rootScope) {
                rootScope = $rootScope;
                peer.on = function () {
                };
                spyOn(peerService, 'get').and.returnValue(peer);
                spyOn(peer, 'on').and.callFake(function (eventName, callBack) {
                    peerCallBack[eventName] = callBack;
                });
                brokerService._peerListener();
            }));
            describe('peer.open', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_onOpen').and.returnValue(true);
                });

                it('should call peer.on with param `open`', function () {
                    expect(peer.on).toHaveBeenCalledWith('open', jasmine.any(Function));
                });
                it('should call `brokerService._onOpen` with `peer`and peerId', function () {
                    peerCallBack.open('peerId');
                    expect(brokerService._onOpen).toHaveBeenCalledWith('peerId');
                });

            });
            describe('peer.call', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_onCall').and.returnValue(true);
                });

                it('should call peer.call with param `call`', function () {
                    expect(peer.on).toHaveBeenCalledWith('call', jasmine.any(Function));
                });
                it('should call `brokerService._onCall` with `peer`and peerId', function () {
                    peerCallBack.call('call');
                    expect(brokerService._onCall).toHaveBeenCalledWith('call');
                });
            });

            describe('peer.connection', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_onConnection').and.returnValue(true);
                });

                it('should call peer.on with param `connection`', function () {
                    expect(peer.on).toHaveBeenCalledWith('connection', jasmine.any(Function));
                });
                it('should call `brokerService._onConnection` with `peer`and peerId', function () {
                    peerCallBack.connection('connection');
                    expect(brokerService._onConnection).toHaveBeenCalledWith('connection');
                });
            });

            describe('peer.error', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_onError').and.returnValue(true);
                });

                it('should call peer.on with param `error`', function () {
                    expect(peer.on).toHaveBeenCalledWith('error', jasmine.any(Function));
                });
                it('should call `brokerService._onError` with `peer`and peerId', function () {
                    peerCallBack.error('error');
                    expect(brokerService._onError).toHaveBeenCalledWith('error');
                });
            });


        });

        describe('_onOpen', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                spyOn(brokerService, 'setPeerId').and.returnValue(true);
                brokerService._onOpen('newPeerId');
            });

            it('should broadcast on $rootscope new peerid', function () {
                expect(rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerOpen', {id: 'newPeerId'});
            });
        });

        describe('_onCall', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                brokerService._onCall('call');
            });
            it('should broadcast call on $rootscope', function () {
                expect(rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerCall', {client: 'call'});
            });
        });

        describe('_onConnection', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                brokerService._onConnection('connection');
            });
            it('should broadcast call on $rootscope', function () {
                expect(rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerConnection', {connection: 'connection'});
            });
        });

        describe('_onError', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                brokerService._onError('error');
            });
            it('should broadcast call on $rootscope', function () {
                expect(rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerError', {error: 'error'});
            });
        });

        describe('connect', function () {
            var peer = {};
            beforeEach(function () {
                peer.connect = function () {
                };
                spyOn(peer, 'connect').and.returnValue('clientConnection');
                spyOn(peerService, 'get').and.returnValue(peer);
            });
            it('should call `peer.connect` with connect id', function () {
                brokerService.connect('clientId');

                expect(peer.connect).toHaveBeenCalledWith('clientId');
            });



            it('should broadcast `BrokerPeerConnection` with return from peer.connect', inject(function ($rootScope) {
                spyOn($rootScope, '$broadcast').and.returnValue(true);

                brokerService.connect('clientId');

                expect($rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerConnection', {
                    connection: 'clientConnection'
                });
            }));
        });

        describe('connectStream', function () {
            var peer = {};
            beforeEach(function () {
                peer.call = function () {
                };
                spyOn(peerService, 'get').and.returnValue(peer);

            });
            it('should call `peer.connect` with connect id', function () {
                spyOn(peer, 'call').and.returnValue('clientConnection');

                brokerService.connectStream('clientId', 'stream', 'metadata');

                expect(peer.call).toHaveBeenCalledWith('clientId', 'stream', {metadata: 'metadata'});
            });
        });

        describe('getPeerId', function () {
            it('should return server id from peer ', function () {
                spyOn(peerService, 'get').and.returnValue({id: 'OurId'});

                expect(brokerService.getPeerId()).toBe('OurId');
            });


        });

    });
})
;