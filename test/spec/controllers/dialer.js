'use strict';

describe('Controller: dialer', function () {

    beforeEach(module('unchatbar'));

    var dialerCTRL, scope, rootScope, brokerService;

    beforeEach(inject(function ($controller, $rootScope, broker) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        brokerService = broker;

        dialerCTRL = function () {
            $controller('dialer', {
                $scope: scope,
                $rootScope: rootScope,
                broker: brokerService

            });
        }
    }));

    describe('check init', function () {
        it('should have an empty peerId by init', function () {
            spyOn(brokerService, 'getPeerId').and.returnValue('');

            dialerCTRL();

            expect(scope.peerId).toEqual('');
        });

        it('should call `broker.getPeerId`', function () {
            spyOn(brokerService, 'getPeerId').and.returnValue('');

            dialerCTRL();

            expect(brokerService.getPeerId).toHaveBeenCalled();
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
            it('should call `broker.connectToClient` width `$scope.connectId `', function () {
                spyOn(brokerService, 'connectToClient').and.returnValue('');
                scope.connectId = 'test';

                scope.connect();

                expect(brokerService.connectToClient).toHaveBeenCalledWith('test');
            });
            it('should set `scope.connectId` to empty string ', function () {
                spyOn(brokerService, 'connectToClient').and.returnValue('');
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
            })
        });
    });

});
