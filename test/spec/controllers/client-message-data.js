'use strict';

describe('Controller: connection', function () {

    beforeEach(module('unchatbar'));

    var connectionCTRL, scope, rootScope, notifyService;

    beforeEach(inject(function ($controller, $rootScope,notify) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        notifyService = notify;

        connectionCTRL = function () {
            $controller('connection', {
                $scope: scope,
                $rootScope: rootScope,
                notify: notifyService
            });
        }
    }));

    describe('check init', function () {
        it('should set `$scope.isOpen` to false , if connect.open is false', function () {
            scope.connect = {
                open: false
            }
            connectionCTRL();
            expect(scope.isOpen).toBeFalsy();
        });
        it('should set `$scope.isOpen` to true, if connect.open is true', function () {
            scope.connect = {
                open: true
            }
            connectionCTRL();
            expect(scope.isOpen).toBeTruthy();
        });
        it('should set `$scope.message` to empty string', function () {
            scope.connect = {
                open: false
            };
            connectionCTRL();
            expect(scope.message).toBe('');
        });
        it('should set `$scope.messageList` to empty array', function () {
            scope.connect = {
                open: false
            };
            connectionCTRL();
            expect(scope.messageList).toEqual([]);
        });

        it('should set `$scope.minimize` to false', function () {
            scope.connect = {
                open: false
            };
            connectionCTRL();
            expect(scope.minimize).toBeFalsy();
        });

        it('should set `$scope.unreadMessageCounter` to 0', function () {
            scope.connect = {
                open: false
            };
            connectionCTRL();
            expect(scope.unreadMessageCounter).toBe(0);
        });
    });

    describe('check methode', function () {
        beforeEach(function () {
            scope.connect = {
                open: false,
                send: function () {
                }
            };
            connectionCTRL();
        });

        describe('send', function () {
            beforeEach(function () {
                spyOn(scope.connect, 'send').and.returnValue(true);
            });
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
        });

        describe('close', function () {
            beforeEach(function () {
                scope.connect.close = function () {
                }
            })
            it('should call `$scope.connect.close()`', function () {
                spyOn(scope.connect, 'close').and.returnValue(true);

                scope.closeConnection();

                expect(scope.connect.close).toHaveBeenCalled();
            });
        });

        describe('toogleMinimize', function () {
            it("should set `$scope.minimize` to true, when `$scope.minimize` is false", function () {
                scope.minimize = false;

                scope.toogleMinimize();

                expect(scope.minimize).toBeTruthy();
            });
            it("should set `$scope.minimize` to false, when `$scope.minimize` is true", function () {
                scope.minimize = true;

                scope.toogleMinimize();

                expect(scope.minimize).toBeFalsy();
            });
            it("should set `$scope.unreadMessageCounter` to 0, when `$scope.minimize` is true", function () {
                scope.minimize = true;
                scope.unreadMessageCounter = 20;
                scope.toogleMinimize();

                expect(scope.unreadMessageCounter).toBe(0);
            });
            it("should not set `$scope.unreadMessageCounter` to 0, when `$scope.minimize` is false", function () {
                scope.minimize = false;
                scope.unreadMessageCounter = 20;
                scope.toogleMinimize();

                expect(scope.unreadMessageCounter).toBe(20);
            });
        });
    });
    describe('check event', function () {
        beforeEach(function () {
            scope.connect = {
                open: false,
                send: function () {
                }
            };
            connectionCTRL();
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
                spyOn(scope, '$emit').and.returnValue(true);
                scope.connectionIndex = 1;

                scope.$broadcast('clientConnection:close', {});

                expect(scope.$emit).toHaveBeenCalledWith('peer:clientDisconnect', {connectionId: 1});
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
