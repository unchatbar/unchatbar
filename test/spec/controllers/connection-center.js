'use strict';

describe('Controller: connectionCenter', function () {

    beforeEach(module('unchatbar'));

    var connectionCenterCTRL, scope, brokerService;

    beforeEach(inject(function ($controller, $rootScope, broker) {
        scope = $rootScope.$new();
        brokerService = broker;
        connectionCenterCTRL = function () {
            $controller('connectionCenter', {
                $scope: scope,
                broker: brokerService
            });
        }
    }));

    describe('check init', function () {
        beforeEach(function () {
            spyOn(brokerService,'getMapOfActiveClients').and.returnValue({activeClient:''})
            connectionCenterCTRL();
        });
        it('should call `broker.getMapOfActiveClients`' , function (){
            expect(brokerService.getMapOfActiveClients).toHaveBeenCalled();
        });
        it('should set `scope.connections` to return value from `broker.getMapOfActiveClients`', function () {
            expect(scope.connections).toEqual({activeClient:''});
        });
    });

    describe('check event', function () {
        describe('peer:clientConnect', function () {
            it('should call ` broker.getMapOfActiveClients` ', function () {
                connectionCenterCTRL();
                spyOn(brokerService,'getMapOfActiveClients').and.returnValue({activeClient:''})

                scope.$broadcast('peer:clientConnect', {});

                expect(brokerService.getMapOfActiveClients).toHaveBeenCalled();
            });
            it('should set ` $scope.connections`  to return value from `broker.getMapOfActiveClients`', function () {
                connectionCenterCTRL();
                spyOn(brokerService,'getMapOfActiveClients').and.returnValue({activeClient:''})

                scope.$broadcast('peer:clientConnect', {});

                expect(scope.connections).toEqual({activeClient:''});
            });
        });
        describe('peer:clientDisconnect', function () {
            it('should call `broker.removeClientFromCalledMap` width ConnectionId from event message', function () {
                connectionCenterCTRL();
                spyOn(brokerService,'removeClientFromCalledMap').and.returnValue(true);

                scope.$broadcast('peer:clientDisconnect', {connectionId: 'conId'});

                expect(brokerService.removeClientFromCalledMap).toHaveBeenCalledWith('conId');
            });
            it('should call `broker.getMapOfActiveClients`', function () {
                connectionCenterCTRL();
                spyOn(brokerService,'removeClientFromCalledMap').and.returnValue(true);
                spyOn(brokerService,'getMapOfActiveClients').and.returnValue({});

                scope.$broadcast('peer:clientDisconnect', {connectionId: 'conId'});

                expect(brokerService.getMapOfActiveClients).toHaveBeenCalled();
            });
            it('should set `$scope.connections` to return value from `broker.getMapOfActiveClients`', function () {
                connectionCenterCTRL();
                spyOn(brokerService,'removeClientFromCalledMap').and.returnValue(true);
                spyOn(brokerService,'getMapOfActiveClients').and.returnValue({dataNew:''});

                scope.$broadcast('peer:clientDisconnect', {connectionId: 'conId'});

                expect(scope.connections).toEqual({dataNew:''});
            });
        });

    });


});
