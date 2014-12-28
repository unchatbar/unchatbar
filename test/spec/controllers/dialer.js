'use strict';

describe('Controller: dialer', function () {

    beforeEach(module('unchatbar'));

    var dialerCTRL, scope, brokerService;

    beforeEach(inject(function ($controller, $rootScope, Broker) {
        scope = $rootScope.$new();
        brokerService = Broker;

        dialerCTRL = function () {
            $controller('dialer', {
                $scope: scope,
                Broker: brokerService

            });
        };
    }));

    describe('check init', function () {
        it('should set `$scope.peerId`to rturn value from `Broker.getPeerId`', function () {
            spyOn(brokerService, 'getPeerId').and.returnValue('peerId');

            dialerCTRL();

            expect(scope.peerId).toEqual('peerId');
        });



        it('should set scope.connectId to empty string', function () {
            spyOn(brokerService, 'getPeerId').and.returnValue('');

            dialerCTRL();

            expect(scope.connectId).toBe('');
        });
    });

    describe('check methode', function () {
        beforeEach(function () {
            spyOn(brokerService, 'getPeerId').and.returnValue('');
            dialerCTRL();
        });
        describe('connect', function () {
            it('should call `broker.connect` width `$scope.connectId `', function () {
                spyOn(brokerService, 'connect').and.returnValue('');
                scope.connectId = 'test';

                scope.connect();

                expect(brokerService.connect).toHaveBeenCalledWith('test');
            });
            it('should set `scope.connectId` to empty string ', function () {
                spyOn(brokerService, 'connect').and.returnValue('');
                scope.connectId = 'test';

                scope.connect();

                expect(scope.connectId).toBe('');
            });
        });
    });
    describe('check event', function () {
        describe('peer:open', function () {
            it('should set `$scope.peerId` to test', function () {
                var peerId = '';
                spyOn(brokerService, 'getPeerId').and.callFake(function(){
                    return peerId;
                });
                dialerCTRL();
                peerId = 'test';

                scope.$broadcast('peer:open', {});

                expect(scope.peerId).toBe('test');
            });
        });
    });

});
