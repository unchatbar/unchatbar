'use strict';

describe('Controller: notify', function () {

    beforeEach(module('unchatbar'));

    var notifyCTRL, scope, messageTextService;

    beforeEach(inject(function ($controller, $rootScope, MessageText) {
        messageTextService = MessageText;
        scope = $rootScope.$new();

        notifyCTRL = function () {
            $controller('notify', {
                $scope: scope,
                MessageText: messageTextService
            });
        };
    }));

    describe('check init', function () {
        it('should set `$scope.unreadMessages` to emty object', function () {
            notifyCTRL();

            expect(scope.unreadMessages).toEqual({});
        });
        it('should set `$scope.countNewMessages` to be 0', function () {
            notifyCTRL();

            expect(scope.countUnreadMessages).toBe(0);
        });
    });

    describe('check methode', function () {
        describe('getUnreadMessages', function () {
            beforeEach(function () {
                notifyCTRL();
                spyOn(messageTextService, 'getMessageInbox').and.returnValue(
                    {
                        roomA: ['mesageA', 'messageB'],
                        roomB: ['mesageC', 'messageD']
                    }
                );
            });
            it('should set `$scope.countNewMessages` to 4', function () {
                scope.getUnreadMessages();

                expect(scope.countUnreadMessages).toBe(4);
            });

            it('should set `$scope.unreadMessages` to rooms with messages', function () {
                scope.getUnreadMessages();

                expect(scope.unreadMessages).toEqual(
                    {
                        roomA: ['mesageA', 'messageB'],
                        roomB: ['mesageC', 'messageD']
                    }
                );
            });
        });
    });

    describe('check events', function () {
        beforeEach(function () {
            notifyCTRL();
            spyOn(scope, 'getUnreadMessages').and.returnValue(true);
        });
        describe('MessageTextGetMessage', function () {
            if ('should call `scope.getUnreadMessages`' , function () {
                    scope.$broadcast('MessageTextGetMessage');
                    expect(scope.getUnreadMessages).toHaveBeenCalled();
                });

        });

        describe('MessageTextMoveToStorage', function () {
            if ('should call `scope.getUnreadMessages`' , function () {
                    scope.$broadcast('MessageTextMoveToStorage');
                    expect(scope.getUnreadMessages).toHaveBeenCalled();
                });
        });

    });
});
