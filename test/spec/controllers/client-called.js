'use strict';

describe('Controller: clientCalled', function () {

    beforeEach(module('webrtcApp'));

    var clientCall, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        clientCall = function () {
            $controller('clientCalled', {
                $scope: scope
            });
        }
    }));

    describe('check init', function () {
        beforeEach(function () {
            clientCall();
        });

        it('should have an empty username by init', function () {
            expect(scope.clientList).toEqual({});
        });
    });

    describe('check event', function () {
        describe('peer:clientConnect', function () {
            it('should set ` $scope.clientList` eventData.connectId', function () {
                clientCall();
                scope.$broadcast('peer:clientConnect', {connectId: 'conId'});

                expect(scope.clientList).toEqual({
                        'conId': {'name': 'conId'}
                    }
                );
            });
        });
        describe('connection:close', function () {
            it('should set ` $scope.clientList` eventData.connectId', function () {
                clientCall();
                scope.clientList = {'conId' : {},'noremove': {}}
                scope.$broadcast('connection:close', {connectId: 'conId'});

                expect(scope.clientList).toEqual({'noremove': {}});
            });
        });
    });


});
