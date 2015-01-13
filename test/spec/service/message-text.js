'use strict';

describe('Serivce: MessageText', function () {
    var BrokerService, rootScope, sessionStorage, MessageTextService, PhoneBookService, ConnectionService;
    beforeEach(module('unchatbar'));


    beforeEach(inject(function ($rootScope, MessageText, Broker, $sessionStorage, PhoneBook, Connection) {
        rootScope = $rootScope;
        MessageTextService = MessageText;
        BrokerService = Broker;
        sessionStorage = $sessionStorage;
        PhoneBookService = PhoneBook;
        ConnectionService = Connection;
    }));

    describe('check methode', function () {
        describe('init', function () {
            beforeEach(function () {
                spyOn(MessageTextService, '_initStorage').and.returnValue(true);
                spyOn(MessageTextService, '_sendFromQueue').and.returnValue(true);
                spyOn(MessageTextService, '_addToInbox').and.returnValue(true);
                MessageTextService.init();
            });
            it('should call `MessageText._initStorage`', function () {
                expect(MessageTextService._initStorage).toHaveBeenCalled();
            });

            it('should call `MessageText._sendFromQueue` after event `ConnectionOpen` with eventdata `peerId`', function () {
                rootScope.$broadcast('ConnectionOpen', {peerId: 'userPeerId'});
                expect(MessageTextService._sendFromQueue).toHaveBeenCalledWith('userPeerId');
            });
            describe('ConnectionGetMessagereadMessage', function () {
                beforeEach(function () {
                    spyOn(MessageTextService, '_removeFromQueue').and.returnValue(true);
                });
                it('should call `MessageText._removeFromQueue` with client peerId and `message.id`', function () {
                    rootScope.$broadcast('ConnectionGetMessagereadMessage', {
                        peerId: 'userPeerId',
                        message: {
                            id: 'UUID'
                        }
                    });
                    expect(MessageTextService._removeFromQueue).toHaveBeenCalledWith('userPeerId', 'UUID');
                });
            });

            describe('ConnectionGetMessagetextMessage', function () {
                it('should call `MessageText._addToInbox` after event `onnection:getMessage:textMessage` with eventdata `message.group.id`', function () {
                    rootScope.$broadcast('ConnectionGetMessagetextMessage',
                        {
                            peerId: 'userId',
                            message: {
                                id: 'uuid',
                                groupId: 'groupId'
                            }
                        }
                    );
                    expect(MessageTextService._addToInbox).toHaveBeenCalledWith('groupId', 'userId', {
                        id: 'uuid',
                        groupId: 'groupId'

                    });
                });
                it('should call `MessageText._addToInbox` after event `onnection:getMessage:textMessage` with eventdata `peerId`', function () {
                    rootScope.$broadcast('ConnectionGetMessagetextMessage',
                        {
                            peerId: 'userId',
                            message: {
                                id: 'uuid',
                                text: 'groupId'
                            }
                        }
                    );
                    expect(MessageTextService._addToInbox).toHaveBeenCalledWith('userId', 'userId', {
                            id: 'uuid',
                            text: 'groupId'
                        }
                    );
                });
            });
        });

        describe('_initStorage', function () {
            var sessionStorage = {};
            beforeEach(inject(function ($sessionStorage) {
                sessionStorage = $sessionStorage;
                spyOn(sessionStorage, '$default').and.returnValue({message: {test: 'data'}});
                MessageTextService._initStorage();
            }));
            it('should call `$sessionStorage.$default` with object', function () {
                expect(sessionStorage.$default).toHaveBeenCalledWith({
                    message: {
                        messages: {},
                        messageInbox : {},
                        queue: {}
                    }
                });
            });
            it('should set  `MessageTextService._storage` return value from `$sessionStorage.$default`', function () {
                expect(MessageTextService._storageMessages).toEqual({test: 'data'});
            });
        });

        describe('setRoom', function () {
            it('should set `MessageText._selectedRoom` type', function () {
                MessageTextService.setRoom('test', 'id');

                expect(MessageTextService._selectedRoom).toEqual({
                    type: 'test',
                    id: 'id'
                });
            });
            it('should reset  `MessageText._selectedRoom` when id is empty', function () {
                MessageTextService.setRoom('test', '');

                expect(MessageTextService._selectedRoom).toEqual({});
            });
            it('should broadcast `MessageTextSetRoom`', function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);

                MessageTextService.setRoom('test', 'id');

                expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageTextSetRoom', {});

            });

        });

        describe('setRoom', function () {
            it('should return true , when room id is defined', function () {
                MessageTextService._selectedRoom.id = 'X';

                expect(MessageTextService.isRoomOpen()).toBeTruthy();
            });
            it('should return false , when no room id is defined', function () {
                MessageTextService._selectedRoom = {};

                expect(MessageTextService.isRoomOpen()).toBeFalsy();
            });


        });
        describe('getMessageList', function () {
            beforeEach(function(){
               spyOn(MessageTextService,'_moveFromInboxToMessageStorage').and.returnValue(true);
            });
            it('should call `MessageText._moveFromInboxToMessageStorage` with selected room', function () {
                MessageTextService._selectedRoom = {id: 'roomId'};
                MessageTextService.getMessageList();
                expect(MessageTextService._moveFromInboxToMessageStorage).toHaveBeenCalledWith('roomId');
            });
            it('should return object from `_storageMessages.messages`', function () {
                MessageTextService._storageMessages.messages = {
                    'Id1': 'testData1',
                    'Id2': 'testData2'
                };
                MessageTextService._selectedRoom = {id: 'Id2'};

                expect(MessageTextService.getMessageList()).toBe('testData2');
            });
        });

        describe('getMessageInbox', function () {

            it('should return object from `_storageMessages.messages`', function () {
                MessageTextService._storageMessages.messageInbox ={data : 'test'};
                MessageTextService._selectedRoom = {id: 'Id2'};

                expect(MessageTextService.getMessageInbox()).toEqual({data : 'test'});
            });
        });

        describe('send', function () {
            beforeEach(function () {
                spyOn(MessageTextService, '_sendToUser').and.returnValue({text: 'messageUser'});
                spyOn(MessageTextService, '_sendToGroup').and.returnValue({text: 'messageGroup'});
                spyOn(MessageTextService, '_addStoStorage').and.returnValue(true);
            });

            describe('send to user', function () {
                beforeEach(function () {
                    MessageTextService._selectedRoom = {type: 'user', id: 'xx'};
                    MessageTextService.send('messageText');
                });
                it('should call `MessageText._sendToUser`', function () {
                    expect(MessageTextService._sendToUser).toHaveBeenCalledWith('messageText');
                });
                it('should call `MessageText._sendToGroup`', function () {
                    expect(MessageTextService._addStoStorage).toHaveBeenCalledWith('xx', 'xx', {
                        text: 'messageUser',
                        own: true
                    });
                });
            });

            describe('send to group', function () {
                beforeEach(function () {
                    MessageTextService._selectedRoom = {type: 'group', id: 'xx'};
                    MessageTextService.send('messageText');

                });
                it('should call `MessageText._sendToGroup`', function () {
                    expect(MessageTextService._sendToGroup).toHaveBeenCalledWith('messageText');
                });
                it('should call `MessageText._sendToGroup`', function () {
                    expect(MessageTextService._addStoStorage).toHaveBeenCalledWith('xx', 'xx', {
                        text: 'messageGroup',
                        own: true
                    });
                });
            });


        });

        describe('sendGroupUpdateToUsers', function () {
            beforeEach(function () {
                spyOn(BrokerService, 'getPeerId').and.returnValue('userPeerId');
                spyOn(ConnectionService, 'send').and.returnValue(true);
                spyOn(MessageTextService, '_addToQueue').and.returnValue(true);
                spyOn(MessageTextService, '_getMessageObject').and.returnValue('message');
            });
            it('should call `MessageText._getMessageObject` with `updateUserGroup` and text object', function () {
                MessageTextService.sendGroupUpdateToUsers([{id: 'user1'}], {
                    owner: 'userPeerId',
                    users: [{id: 'user1'}]
                });
                expect(MessageTextService._getMessageObject).toHaveBeenCalledWith('updateUserGroup', {
                    group: {
                        owner: 'userPeerId',
                        users: [{id: 'user1'}]
                    }
                });
            });


            describe('group owner is not actual user', function () {
                it('should not call `ConnectionService.send`', function () {
                    MessageTextService.sendGroupUpdateToUsers([{id: 'user1'}, {id: 'user1'}], {
                        owner: 'otherUse',
                        users: [{id: 'user1'}, {id: 'user1'}]
                    });
                    expect(ConnectionService.send).not.toHaveBeenCalled();
                });
            });


            describe('group owner is actual user', function () {
                beforeEach(function () {
                    MessageTextService.sendGroupUpdateToUsers([{id: 'user1'}], {
                        owner: 'userPeerId',
                        users: [{id: 'user1'}]
                    });
                });

                it('should call `Connection.send`', function () {
                    expect(ConnectionService.send).toHaveBeenCalledWith('user1', 'message');
                });

                it('should call `MessageText._addToQueue`', function () {
                    expect(MessageTextService._addToQueue).toHaveBeenCalledWith('user1', 'message');
                });
            });

            describe('user is actual client', function () {
                beforeEach(function () {
                    MessageTextService.sendGroupUpdateToUsers([{id: 'userPeerId'}], {
                        owner: 'userPeerId',
                        users: [{id: 'userPeerId'}]
                    });
                });
                it('should not call `Connection.send`', function () {
                    expect(ConnectionService.send).not.toHaveBeenCalled();
                });
            });
        });
        describe('_getMessageObject', function () {
            beforeEach(function () {
                spyOn(MessageTextService, '_createUUID').and.returnValue('UUId');
            });

            it('should add UUid and action to message object', function () {
                expect(MessageTextService._getMessageObject('testAction', {test: 'data'})).toEqual(
                    {
                        test: 'data',
                        action: 'testAction',
                        id: 'UUId'
                    }
                );
            });
        });
        describe('sendRemoveGroup', function () {
            beforeEach(function () {
                spyOn(MessageTextService, '_getMessageObject').and.returnValue('message');
                spyOn(MessageTextService, '_addToQueue').and.returnValue(true);
                spyOn(ConnectionService, 'send').and.returnValue(true);
            });

            it('should call `MessageText._getMessageObject` with `updateUserGroup` and text object', function () {
                spyOn(PhoneBookService, 'getGroup').and.returnValue({owner: 'other'});
                MessageTextService.sendRemoveGroup('roomId');

                expect(MessageTextService._getMessageObject).toHaveBeenCalledWith('removeGroup', {roomId: 'roomId'});
            });
            it('should call `PhoneBook.getGroup` with room id', function () {
                spyOn(BrokerService, 'getPeerId').and.returnValue('Otheruser');
                spyOn(PhoneBookService, 'getGroup').and.returnValue({owner: 'other'});
                MessageTextService.sendRemoveGroup('roomId');

                expect(PhoneBookService.getGroup).toHaveBeenCalledWith('roomId');
            });

            describe('group owner is actual user', function () {
                beforeEach(function () {
                    spyOn(BrokerService, 'getPeerId').and.returnValue('userPeerId');
                    spyOn(PhoneBookService, 'getGroup').and.returnValue({
                        owner: 'userPeerId',
                        users: [{id: 'user1'}]
                    });
                });
                it('should call `Connection.send` to ower', function () {
                    MessageTextService.sendRemoveGroup('roomId');
                    expect(ConnectionService.send).toHaveBeenCalledWith('user1', 'message');
                });

                it('should call `Connection.send` to users', function () {
                    MessageTextService.sendRemoveGroup('roomId');
                    expect(MessageTextService._addToQueue).toHaveBeenCalledWith('user1', 'message');
                });
            });
            describe('group owner is actual user', function () {
                beforeEach(function () {
                    spyOn(BrokerService, 'getPeerId').and.returnValue('userPeerId');
                    spyOn(PhoneBookService, 'getGroup').and.returnValue({
                        owner: 'userPeerId',
                        users: [{id: 'userPeerId'}]
                    });
                });
                it('should call `Connection.send` to ower', function () {
                    MessageTextService.sendRemoveGroup('roomId');
                    expect(ConnectionService.send).not.toHaveBeenCalled();
                });
            });
        });

        describe('_addStoStorage', function () {
            it('should push _storageMessages.messages[roomId] with message', function () {
                MessageTextService._storageMessages.messages = {};
                MessageTextService._addStoStorage('roomId', 'fromUser', {
                    text: 'testText',
                    own: 'ownMessage'
                });

                expect(MessageTextService._storageMessages.messages).toEqual(
                    {
                        roomId: [
                            {
                                text: 'testText',
                                user: 'fromUser',
                                own: 'ownMessage'
                            }
                        ]
                    }
                );
            });
        });

        describe('_addToInbox', function () {
            it('should push _storageMessages.messages[roomId] with message', function () {
                MessageTextService._storageMessages.messageInbox = {};
                MessageTextService._addToInbox('roomId', 'fromUser', {
                    text: 'testText',
                    own: 'ownMessage'
                });

                expect(MessageTextService._storageMessages.messageInbox).toEqual(
                    {
                        roomId: [
                            {
                                text: 'testText',
                                user: 'fromUser',
                                own: 'ownMessage'
                            }
                        ]
                    }
                );
            });

            it('should broadcast `MessageTextGetMessage` with isRoomVisible false', function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                MessageTextService._selectedRoom.id = 'otherRoomId';
                MessageTextService._addToInbox('roomId', 'fromUser', {
                    text: 'testText',
                    own: 'ownMessage'
                });

                expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageTextGetMessage',{isRoomVisible : false});
            });

            it('should broadcast `MessageTextGetMessage` with isRoomVisible true', function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                MessageTextService._selectedRoom.id = 'roomId';
                MessageTextService._addToInbox('roomId', 'fromUser', {
                    text: 'testText',
                    own: 'ownMessage'
                });

                expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageTextGetMessage',{isRoomVisible : true});
            });
        });

        describe('_moveFromInboxToMessageStorage', function () {
            beforeEach(function(){
                MessageTextService._storageMessages.messageInbox = {
                    'roomId': [{user:'userId',text:'message'}]
                };
                spyOn(MessageTextService,'_addStoStorage').and.returnValue(true);
                spyOn(rootScope,'$broadcast').and.returnValue(true);
                MessageTextService._moveFromInboxToMessageStorage('roomId');
            });
           it('should call `MessageText._addStoStorage` with roomId, userId and message '  ,function(){
              expect(MessageTextService._addStoStorage).toHaveBeenCalledWith(
                  'roomId',
                  'userId',
                  {user:'userId',text:'message'}
              );
           });

           it('should removemessageInbox ', function () {
                expect(MessageTextService._storageMessages.messageInbox).toEqual({});
           });

            it('should broadcast `MessageTextMoveToStorage` ', function () {
                expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageTextMoveToStorage',{});
            });
        });

        describe('_sendToUser', function () {
            beforeEach(function () {
                MessageTextService._selectedRoom.id = 'roomId';
                spyOn(BrokerService, 'getPeerId').and.returnValue('peerId');
                spyOn(MessageTextService, '_addToQueue').and.returnValue(true);
                spyOn(MessageTextService, '_getMessageObject').and.returnValue('message');
            });
            it('should call `MessageText._getMessageObject` with `textMessage` and text object', function () {
                spyOn(ConnectionService, 'send').and.returnValue(true);
                MessageTextService._sendToUser('test messageText');
                expect(MessageTextService._getMessageObject).toHaveBeenCalledWith('textMessage', {
                    text: 'test messageText'
                });
            });
            it('should call `Connection.send` with selected room id and message object', function () {
                spyOn(ConnectionService, 'send').and.returnValue(true);
                MessageTextService._sendToUser('test messageText');
                expect(ConnectionService.send).toHaveBeenCalledWith('roomId', 'message');
            });

            it('should call `MessageText._addToQueue` with roomId and message', function () {
                spyOn(ConnectionService, 'send').and.returnValue(true);

                MessageTextService._sendToUser('test messageText');

                expect(MessageTextService._addToQueue).toHaveBeenCalledWith('roomId', 'message');
            });

        });

        describe('_sendToGroup', function () {
            beforeEach(function () {
                spyOn(BrokerService, 'getPeerId').and.returnValue('clientPeerId');
                spyOn(MessageTextService, '_addToQueue').and.returnValue(true);
                spyOn(MessageTextService, '_getMessageObject').and.returnValue('message');
            });
            it('should call `MessageText._getMessageObject` with `textMessage` and text object', function () {
                spyOn(ConnectionService, 'send').and.returnValue(true);
                spyOn(PhoneBookService, 'getGroup').and.returnValue({id: 'groupId', owner: 'clientPeerId', users: []});

                MessageTextService._sendToGroup('test messageText');
                expect(MessageTextService._getMessageObject).toHaveBeenCalledWith('textMessage', {
                    text: 'test messageText',
                    groupId: 'groupId'

                });
            });

            it('should return message object', function () {
                spyOn(PhoneBookService, 'getGroup').and.returnValue({id: 'groupId', owner: 'clientPeerId', users: []});
                expect(MessageTextService._sendToGroup('test text')).toEqual('message');
            });

            describe('user is sender', function () {
                beforeEach(function () {
                    spyOn(PhoneBookService, 'getGroup').and.returnValue({
                        id: 'groupId',
                        owner: 'otherPeerId',
                        users: [{id: 'clientPeerId'}]
                    });
                });
                it('should not send to own ', function () {
                    spyOn(ConnectionService, 'send').and.returnValue(true);

                    MessageTextService._sendToGroup('test text');

                    expect(ConnectionService.send).not.toHaveBeenCalled();
                });

            });

            describe('sender is owner', function () {
                beforeEach(function () {
                    spyOn(PhoneBookService, 'getGroup').and.returnValue({
                        owner: 'clientPeerId',
                        id: 'groupId',
                        users: [{id: 'userId'}]
                    });
                });
                it('should call `Connection.send` with userId id', function () {
                    spyOn(ConnectionService, 'send').and.returnValue(true);
                    MessageTextService._sendToGroup('test text');
                    expect(ConnectionService.send).toHaveBeenCalledWith('userId', 'message');
                });
                it('should not call `MessageText._addToQueue` with userId id', function () {
                    spyOn(ConnectionService, 'send').and.returnValue(true);
                    MessageTextService._sendToGroup('test text');
                    expect(MessageTextService._addToQueue).toHaveBeenCalledWith('userId', 'message');
                });
            });
        });

        describe('_addToQueue', function () {
            it('should push `_storageMessages.queue` to peerId key', function () {
                MessageTextService._storageMessages.queue = {};
                MessageTextService._addToQueue('peerId', {id: 'UUId', test: 'data'});
                expect(MessageTextService._storageMessages.queue).toEqual({
                    'peerId': {
                        UUId: {id: 'UUId', test: 'data'}
                    }
                });
            });
        });

        describe('_sendFromQueue', function () {
            describe('peerId has no items in queue ', function () {
                beforeEach(function () {
                    MessageTextService._storageMessages.queue = {};
                    spyOn(ConnectionService, 'send').and.returnValue(true);

                });
                it('should not call `Connection.send` for message in storage queue', function () {

                    MessageTextService._sendFromQueue('peerId');

                    expect(ConnectionService.send).not.toHaveBeenCalled();
                });
            });
            describe('peerId has items in queue ', function () {
                beforeEach(function () {
                    MessageTextService._storageMessages.queue = {'peerId': ['message']};
                });
                it('should not call `Connection.send` for message in storage queue', function () {
                    spyOn(ConnectionService, 'send').and.returnValue(true);
                    MessageTextService._sendFromQueue('peerId');
                    expect(ConnectionService.send).toHaveBeenCalledWith('peerId', 'message');
                });
            });
        });

        describe('_removeFromQueue', function () {
            it('should remove mesage from client', function () {
                MessageTextService._storageMessages.queue = {
                    peerId: {
                        messageIdA: 'data',
                        messageIdB: 'data'
                    }
                };
                MessageTextService._removeFromQueue('peerId', 'messageIdA');

                expect(MessageTextService._storageMessages.queue).toEqual({
                    peerId: {
                        messageIdB: 'data'
                    }
                });
            });

            it('should remove client from queue', function () {
                MessageTextService._storageMessages.queue = {
                    peerId: {
                        messageIdA: 'data'
                    }
                };
                MessageTextService._removeFromQueue('peerId', 'messageIdA');

                expect(MessageTextService._storageMessages.queue).toEqual({});
            });
        });
    });
})
;