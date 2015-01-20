'use strict';

describe('Controller: notify', function () {

    beforeEach(module('unchatbar'));

    var notifyCTRL, scope, notifyService,messageTextService, StreamService, PhoneBookService;

    beforeEach(inject(function ($controller, $rootScope, MessageText, PhoneBook, Stream, Notify) {
        messageTextService = MessageText;
        scope = $rootScope.$new();
        PhoneBookService = PhoneBook;
        StreamService = Stream;
        notifyService = Notify;
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

        it('should set `$scope.countNewMessages` to be 0', function () {
            notifyCTRL();

            expect(scope.waitingCallsForAnswer).toEqual({});
        });
    });

    describe('check methode', function () {
        describe('getClient', function () {
            beforeEach(function () {
                notifyCTRL();
                spyOn(PhoneBookService, 'getClient').and.returnValue({label: 'test'});
            });
            it('should call `PhoneBook.getClient` with `peerId` ', function () {
                scope.getClient('peerId');

                expect(PhoneBookService.getClient).toHaveBeenCalledWith('peerId');
            });

            it('should return object from `PhoneBook.getClient` ', function () {
                expect(scope.getClient('peerId')).toEqual({label: 'test'});
            });
        });

        describe('getGroup', function () {
            beforeEach(function () {
                notifyCTRL();
                spyOn(PhoneBookService, 'getGroup').and.returnValue({label: 'testGroup'});
            });
            it('should call `PhoneBook.getClient` with `peerId` ', function () {
                scope.getGroup('groupId');

                expect(PhoneBookService.getGroup).toHaveBeenCalledWith('groupId');
            });

            it('should return object from `PhoneBook.getClient` ', function () {
                expect(scope.getGroup('groupId')).toEqual({label: 'testGroup'});
            });
        });

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

        describe('answerStreamCall' , function(){
            beforeEach(function(){
                notifyCTRL();
                spyOn(StreamService,'answerCall').and.returnValue(true);
                spyOn(scope,'setSoundForStream').and.returnValue(true);
            });
            it('should call `Stream.answerCall`' , function() {
                scope.answerStreamCall({connection : 'data'});
                expect(StreamService.answerCall).toHaveBeenCalledWith({connection : 'data'});
            });
            it('should call `Stream.answerCall` with connection and metadata.metadata.streamOption' , function() {
                scope.answerStreamCall({connection : 'data'});
                expect(scope.setSoundForStream).toHaveBeenCalled();
            });
        });

        describe('closeStreamCall' , function(){
            beforeEach(function(){
                notifyCTRL();
                spyOn(StreamService,'cancelCall').and.returnValue(true);
                spyOn(scope,'setSoundForStream').and.returnValue(true);
            });
            it('should call `Stream.cancelCall` with connection' , function() {
                scope.closeStreamCall({connection : 'data'});
                expect(StreamService.cancelCall).toHaveBeenCalledWith({connection : 'data'});
            });
            it('should call `Stream.answerCall` with connection and metadata.metadata.streamOption' , function() {
                scope.closeStreamCall({connection : 'data'});
                expect(scope.setSoundForStream).toHaveBeenCalled();
            });
        });

        describe('setSoundForStream' , function(){
            beforeEach(function(){
                notifyCTRL();
                spyOn(notifyService,'streamCallStart').and.returnValue(true);
                spyOn(notifyService,'streamCallStop').and.returnValue(true);
            });

            it('should call `Stream.cancelCall` with connection' , function() {
                spyOn(StreamService,'getCallsForAnswerMap').and.returnValue({connection : 'data'});
                scope.setSoundForStream();
                expect(StreamService.getCallsForAnswerMap).toHaveBeenCalled();
            });
            describe('call waiting for answer ' , function(){
                beforeEach(function(){
                    spyOn(StreamService,'getCallsForAnswerMap').and.returnValue({connection : 'data'});
                });
                it('should call `Notify.streamCallStart`' , function(){
                    scope.setSoundForStream();

                    expect(notifyService.streamCallStart).toHaveBeenCalled();
                });
            });
            describe('no call waiting for answer ' , function(){
                beforeEach(function(){
                    spyOn(StreamService,'getCallsForAnswerMap').and.returnValue({});
                });

                it('should call `Notify.streamCallStart`' , function(){
                    scope.setSoundForStream();

                    expect(notifyService.streamCallStop).toHaveBeenCalled();
                });

            });

        });
    });

    describe('check events', function () {
        beforeEach(function () {
            notifyCTRL();
            spyOn(scope, 'getUnreadMessages').and.returnValue(true);
        });
        describe('StreamAddClient', function () {
            it('should set return value from `Stream.getCallsForAnswerList` to `$scope.waitingCallsForAnswer`', function () {
                spyOn(scope, 'setSoundForStream').and.returnValue(['call']);
                scope.$broadcast('StreamAddClient');

                expect(scope.setSoundForStream).toHaveBeenCalled();
            });
        });

        describe('MessageTextGetMessage', function () {
            it('should call `scope.getUnreadMessages`', function () {
                scope.$broadcast('MessageTextGetMessage');
                expect(scope.getUnreadMessages).toHaveBeenCalled();
            });
        });

        describe('MessageTextMoveToStorage', function () {
            it('should call `scope.getUnreadMessages`', function () {
                scope.$broadcast('MessageTextMoveToStorage');
                expect(scope.getUnreadMessages).toHaveBeenCalled();
            });
        });

    });
});
