'use strict';

describe('Controller: clientMessageData', function () {

    beforeEach(module('webrtcApp'));

    var clientMessageData, scope, rootScope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        rootScope = $rootScope;

        clientMessageData = function () {
            $controller('clientMessageData', {
                $scope: scope,
                $rootScope: rootScope
            });
        }
    }));

    describe('check init', function () {
        it('should set `$scope.isOpen` to false , if connect.open is false', function () {
            scope.connect = {
                open: false
            }
            clientMessageData();
            expect(scope.isOpen).toBeFalsy();
        });
        it('should set `$scope.isOpen` to true, if connect.open is true', function () {
            scope.connect = {
                open: true
            }
            clientMessageData();
            expect(scope.isOpen).toBeTruthy();
        });
        it('should set `$scope.message` to empty string', function () {
            scope.connect = {
                open: false
            };
            clientMessageData();
            expect(scope.message).toBe('');
        });
        it('should set `$scope.messageList` to empty array', function () {
            scope.connect = {
                open: false
            };
            clientMessageData();
            expect(scope.messageList).toEqual([]);
        });
    });

    describe('check methode', function () {
        beforeEach(function () {
            scope.connect = {
                open: false,
                send: function () {
                }
            };
        });
        describe('send', function () {
            beforeEach(function () {
                spyOn(scope.connect, 'send').and.returnValue(true);
                clientMessageData();

            })
            it('should call `$scope.connect.send` width `$scope.message`', function () {
                scope.message = 'test';

                scope.send();

                expect(scope.connect.send).toHaveBeenCalledWith('test');
            });
            it('should push `$scope.messageLst` width `$scope.message` and property `own` true', function () {
                scope.message = 'test';

                scope.send();

                expect(scope.messageList).toEqual([{own: true, text: 'test'}]);
            });

            it('should set `$scope.message` to empty string', function () {
                scope.message = 'test';

                scope.send();

                expect(scope.message).toBe('');
            });
        })
    });
    describe('check event', function () {
        beforeEach(function () {
            scope.connect = {
                open: false,
                send: function () {
                }
            };
            clientMessageData();
        });
        describe('clientConnection:open', function () {
            it('should set `$scope.isOpen` to true', function () {
                scope.isOpen = false;

                scope.$broadcast('clientConnection:open', {});

                expect(scope.isOpen).toBeTruthy();
            });
        });
        describe('clientConnection:close', function () {
            it('should set `$scope.isOpen` to false', function () {
                scope.isOpen = false;



                scope.$broadcast('clientConnection:close', {});

                expect(scope.isOpen).toBeFalsy();
            });

            it('should call scope.$emit', function () {
                spyOn(scope,'$emit').and.returnValue(true);
                scope.connectionIndex = 1;

                scope.$broadcast('clientConnection:close', {});

                expect(scope.$emit).toHaveBeenCalledWith('peer:clientDisconnect', {connectionIndex: 1});
            });
        });
        describe('clientConnection:data', function () {
            it('should push `$scope.messageList` to {own: false, text: data}', function () {
                scope.isOpen = false;

                scope.$broadcast('clientConnection:data', {text: 'text'});

                expect(scope.messageList).toEqual([{own: false, text: {text: 'text'}}]);
            });
        });

    });

});
