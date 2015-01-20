'use strict';

describe('Serivce: Notify', function () {
    var windowService, notifyService;

    beforeEach(module('unchatbar'));


    beforeEach(inject(function ($window, Notify) {
        windowService = $window;
        notifyService = Notify;
    }));

    describe('check methode', function () {

        describe('init', function () {
            beforeEach(function () {
                spyOn(notifyService, '_getNotificationPermission').and.returnValue(true);
                spyOn(notifyService, '_initMessageSound').and.returnValue(true);
                spyOn(notifyService, '_initStreamSound').and.returnValue(true);
                notifyService.init();
            });
            it('should call `notify._getNotificationPermission`', function () {
                expect(notifyService._getNotificationPermission).toHaveBeenCalled();
            });
            it('should call `notify._initMessageSound`', function () {
                expect(notifyService._initMessageSound).toHaveBeenCalled();
            });
            it('should call `notify._initStreamSound`', function () {
                expect(notifyService._initStreamSound).toHaveBeenCalled();
            });
        });

        describe('textMessage', function () {
            beforeEach(function () {
                notifyService._textMessageSound = {
                    play: function () {
                    }
                };
                spyOn(notifyService, '_sendNotify').and.returnValue(true);
                spyOn(notifyService._textMessageSound, 'play').and.returnValue(true);
            });
            describe('page is hidden', function () {
                beforeEach(function () {
                    spyOn(notifyService, '_isPageHidden').and.returnValue(true);
                    notifyService.textMessage('testMessage');
                });
                it('should call `notify._sendNotify` with headline,message and tag', function () {
                    expect(notifyService._sendNotify)
                        .toHaveBeenCalledWith('unchatbar - new Text Messages', 'testMessage', 'newTextMessage');
                });
                it('should call `notify._textMessageSound.play`', function () {
                    expect(notifyService._textMessageSound.play).toHaveBeenCalled();
                });
            });

            describe('page is visible', function () {
                beforeEach(function () {
                    spyOn(notifyService, '_isPageHidden').and.returnValue(false);
                    notifyService.textMessage('testMessage');
                });
                it('should not call `notify._sendNotify`', function () {
                    expect(notifyService._sendNotify).not.toHaveBeenCalled();
                });
                it('should call `notify._textMessageSound.play`', function () {
                    expect(notifyService._textMessageSound.play).not.toHaveBeenCalled();
                });
            });
        });

        describe('_getNotificationPermission', function () {
            var callbackNotificationPermission;
            beforeEach(function () {
                windowService.Notification = {
                    requestPermission: function () {
                    },
                    permission: ''

                };
                spyOn(notifyService, '_hasNotificationPermission').and.returnValue(false);
                spyOn(windowService.Notification, 'requestPermission').and.callFake(function (callback) {
                    callbackNotificationPermission = callback;
                });
                notifyService._getNotificationPermission();
            });
            it('should call `notify._hasNotificationPermission`', function () {
                expect(notifyService._hasNotificationPermission).toHaveBeenCalled();
            });

            it('should set callback status from `window.Notification.requestPermission` ' +
            'to $window.Notification.permission', function () {
                callbackNotificationPermission('newStatus');
                expect(windowService.Notification.permission).toBe('newStatus');
            });
        });

        describe('_initMessageSound', function () {
            beforeEach(function () {
                windowService.Audio = function () {
                };
                notifyService._textMessageAudioFile = 'myTestAudioFile.mp3';
                spyOn(windowService, 'Audio').and.callFake(function () {
                    return ({'audio': 'test'});
                });
                notifyService._initMessageSound();
            });
            it('should call window.audio object with audio file', function () {
                expect(windowService.Audio).toHaveBeenCalledWith('myTestAudioFile.mp3');
            });
            it('should set `notify._textMessageSound` to window.audio object', function () {
                expect(notifyService._textMessageSound).toEqual({'audio': 'test', volume: 1.0});
            });
        });

        describe('_initStreamSound', function () {
            beforeEach(function () {
                windowService.Audio = function () {
                };
                notifyService._streamCallAudioFile = 'myStreamAudioFile.mp3';
                spyOn(windowService, 'Audio').and.callFake(function () {
                    return ({'audio': 'test'});
                });
                notifyService._initStreamSound();
            });
            it('should call window.audio object with audio file', function () {
                expect(windowService.Audio).toHaveBeenCalledWith('myStreamAudioFile.mp3');
            });
            it('should set `notify._textMessageSound` to window.audio object', function () {
                expect(notifyService._textMessageSound).toEqual({'audio': 'test', volume: 1.0, loop : true});
            });
        });

        describe('streamCallStart' , function(){
            it('should call _textMessageSound.play' ,function(){
                notifyService._textMessageSound = {
                    play: function(){}
                };
                spyOn(notifyService._textMessageSound,'play').and.returnValue(true);

                notifyService.streamCallStart();

                expect(notifyService._textMessageSound.play).toHaveBeenCalled();
            });
        });

        describe('streamCallStop' , function(){
            it('should call _textMessageSound.play' ,function(){
                notifyService._textMessageSound = {
                    pause: function(){}
                };
                spyOn(notifyService._textMessageSound,'pause').and.returnValue(true);

                notifyService.streamCallStop();

                expect(notifyService._textMessageSound.pause).toHaveBeenCalled();
            });
        });

        describe('_hasNotificationPermission', function () {
            it('should return true, when $window.Notification.permission is granted', function () {
                windowService.Notification = {
                    permission: 'granted'
                };
                expect(notifyService._hasNotificationPermission()).toBe(true);
            });
            it('should return true, when $window.Notification.permission is not granted', function () {
                windowService.Notification = {
                    permission: 'otherValue'
                };
                expect(notifyService._hasNotificationPermission()).toBe(false);
            });
        });

        describe('_isPageHidden', function () {
            it('should return true when `document.hidden` is set', function () {
                document.hidden = true;
                expect(notifyService._isPageHidden()).toBe(true);
            });

            it('should return false when `document.hidden` is set', function () {
                document.hidden = false;
                expect(notifyService._isPageHidden()).toBe(false);
            });
        });

        describe('_sendNotify', function () {
            beforeEach(function () {
                windowService.Notification = function () {
                };
                spyOn(windowService,'Notification').and.returnValue(true);
            });
            it('should call `notify._hasNotificationPermission`', function () {
                spyOn(notifyService, '_hasNotificationPermission').and.returnValue(false);
                notifyService._sendNotify('headline', 'mess', 'tag');
                expect(notifyService._hasNotificationPermission).toHaveBeenCalled();
            });
            it('should not call `$window._sendNotify` when no Notification Permission', function () {
                spyOn(notifyService, '_hasNotificationPermission').and.returnValue(false);
                notifyService._sendNotify('headline', 'mess', 'tag');
                expect(windowService.Notification).not.toHaveBeenCalled();
            });

            describe('has Notification Permission', function () {
                beforeEach(function () {
                    spyOn(notifyService, '_hasNotificationPermission').and.returnValue(true);
                });
                it('should call `$window.Notification` with headline,message and tag', function () {
                    notifyService._sendNotify('headlineTest', 'testMessage', 'testTag');
                    expect(windowService.Notification).toHaveBeenCalledWith(
                        'headlineTest',
                        {
                            body: 'testMessage',
                            tag: 'testTag'
                        }
                    );
                });
            });
        });
    });
});