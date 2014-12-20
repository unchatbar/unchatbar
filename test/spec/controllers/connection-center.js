'use strict';

describe('Controller: connectionCenter', function () {

    beforeEach(module('unchatbar'));

    var connectionCenterCTRL, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        connectionCenterCTRL = function () {
            $controller('connectionCenter', {
                $scope: scope

            });
        };
    }));

    describe('check init', function () {
        beforeEach(function () {
            connectionCenterCTRL();
        });

        it('should set `scope.connections` to empty object', function () {
            expect(scope.connections).toEqual({});
        });
    });

    describe('check event', function () {
        beforeEach(function(){
            connectionCenterCTRL();
        });
        describe('client:connect', function () {
            it('should add `$scope.connections` with connection.peer and connection ', function () {
                scope.connections = {};
                scope.$broadcast('client:connect',{connection:{peer:'testPeerId',send : 'function'}});
                scope.$apply();

                expect(scope.connections).toEqual({testPeerId: {peer:'testPeerId',send : 'function'}});
            });
        });
        describe('peer:clientDisconnect', function () {
            it('should remove key `deleteItem` from  `$scope.connections`', function () {
                scope.connections = {'deleteItem': 'test', 'noDelete': 'test'};
                scope.$broadcast('peer:clientDisconnect', {connectionId: 'deleteItem'});
                scope.$apply();

                expect(scope.connections).toEqual({'noDelete': 'test'});
            });
        });

    });


});
