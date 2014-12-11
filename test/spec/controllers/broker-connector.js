'use strict';

xdescribe('Controller: brokerConnector', function () {

    beforeEach(module('webrtcApp'));

    var brokerConnector, scope, broker;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        broker = {
            init: function () {
            }
        };
        brokerConnector = function () {
            $controller('brokerConnector', {
                $scope: scope,
                broker: broker
            });
        }
    }));

    describe('check init', function () {
        beforeEach(function () {
            brokerConnector();
        });

        it('should have an empty username by init', function () {
            expect(scope.username).toBe('');
        });

        it('should set `$scope.init` to false', function () {
            expect(scope.init).toBeFalsy();
        });
    })
    describe('check event `peer:open`', function () {
        beforeEach(function () {
            brokerConnector();
        });

        it('should set ` $scope.username` eventData.id', function () {
            scope.$broadcast('peer:open', {id: 'test'});

            expect(scope.username).toBe('test');
        });

        it('should set ` $scope.init` true', function () {
            scope.$broadcast('peer:open', {id: 'test'});

            expect(scope.username).toBeTruthy;
        });
    });

    describe('check methodes', function () {
        describe('connect', function () {
            it('should call broker.init width $scope.username', function () {
                spyOn(broker, 'init').and.returnValue(true);
                brokerConnector();
                scope.username = 'test';

                scope.connect();

                expect(broker.init).toHaveBeenCalledWith('test');
            });
        });
    });
});
