'use strict';

describe('Controller: clientMessages', function () {

    beforeEach(module('webrtcApp'));

    var clientMessages, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        clientMessages = function () {
            $controller('clientMessages', {
                $scope: scope
            });
        }
    }));

    describe('check init', function () {
        beforeEach(function () {
            clientMessages();
        });

        it('should have an empty `scope.connections` by init', function () {
            expect(scope.connections).toEqual({});
        });
    });

    describe('check event', function () {
        describe('peer:clientConnect', function () {
            it('should push ` $scope.connections` eventData.connectId', function () {
                clientMessages();
                scope.$broadcast('peer:clientConnect', {connectId: 'conId',connection: 'connection'});

                expect(scope.connections).toEqual({
                        'conId': 'connection'
                    }
                );
            });
        });
        describe('peer:clientDisconnect', function () {
            it('should push ` $scope.connections` eventData.connectId', function () {
                clientMessages();
                scope.connections = {
                    'notRemove' : {},
                    'conId' : {},
                    'notRemove2' : {}
                }
                scope.$broadcast('peer:clientDisconnect', {connectId: 'conId'});

                expect(scope.connections).toEqual({
                        'notRemove' : {},
                        'notRemove2' : {}
                    }
                );
            });
        });

    });


});
