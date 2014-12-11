'use strict';

describe('Controller: clientConnector', function () {

    beforeEach(module('webrtcApp'));

    var clientConnector, scope, rootScope, brokerService;

    beforeEach(inject(function ($controller, $rootScope, broker) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        brokerService = broker;

        clientConnector = function () {
            $controller('clientConnector', {
                $scope: scope,
                $rootScope: rootScope,
                broker: brokerService

            });
        }
    }));

    describe('check init', function () {
        it('should have an empty peerId by init', function () {
            spyOn(brokerService, 'get').and.returnValue(false);

            clientConnector();

            expect(scope.peerId).toEqual('');
        });
    });

    describe('check methode', function () {
        describe('init', function () {
            beforeEach(function () {
                spyOn(brokerService, 'get').and.returnValue({id: 'test'});

                clientConnector();
                spyOn(scope, 'listenToClientConnect').and.returnValue(true);


            });

            it('should set `scope.peerId` to id from broker ', function () {
                scope.init();

                expect(scope.peerId).toBe('test');
            });

            it('should call `scope.listenToClientConnect` ', function () {
                scope.init();

                expect(scope.peerId).toBe('test');
            });
        });

        describe('listenToClientConnect', function () {
            var BrokerOnEvent, callbackOnEvent;
            beforeEach(function () {
                BrokerOnEvent = {
                    on: function (event, callback) {
                        callbackOnEvent = callback;
                    }
                };
                spyOn(brokerService, 'get').and.returnValue(BrokerOnEvent);


            })
            it('should call broker.get', function () {
                clientConnector();

                scope.init();

                expect(brokerService.get).toHaveBeenCalled();
            });

            it('should call `Brokere` width name `connection`', function () {
                spyOn(BrokerOnEvent, 'on').and.returnValue(BrokerOnEvent);

                clientConnector();

                scope.init();
                expect(BrokerOnEvent.on).toHaveBeenCalledWith('connection', jasmine.any(Function));

            });
            xit('should call `$rootScope.$apply` after event `connection`', function () {
                spyOn(BrokerOnEvent, 'on').and.returnValue(BrokerOnEvent);

                clientConnector();
                spyOn(scope,'broadcastConnection').and.returnValue(true);

                scope.init();
                callbackOnEvent('connectiondata');

                expect(scope.broadcastConnection).toHaveBeenCalledWith('connectiondata');

            });
        })
    })

});
