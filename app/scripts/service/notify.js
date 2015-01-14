'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar.Notify
 * @description
 *
 * output notification
 *
 */
angular.module('unchatbar')
    .service('Notify', ['$rootScope', '$window','MessageText','PhoneBook',
        function ($rootScope, $window,MessageText, PhoneBook) {
            var isHidden = false,
                canDesktopNotify = false,
                canVibration = false;
            var api = {

                /**
                 * @ngdoc methode
                 * @name init
                 * @methodOf unchatbar.Notify
                 * @description
                 *
                 * init listener
                 *
                 */
                init: function () {
                    api._initDesktopNotification();
                    document.addEventListener('visibilitychange', api.visibilitychanged);
                    document.addEventListener('webkitvisibilitychange', api.visibilitychanged);
                    document.addEventListener('msvisibilitychange', api.visibilitychanged);
                    $rootScope.$on('MessageTextGetMessage', function (event, data) {
                         if (data.isRoomVisible === false && isHidden === true) {
                            api._messageToDesktop();
                             api._vibrate();
                         }
                    });
                },
                _vibrate : function () {
                    if(canVibration) {
                        navigator.vibrate(1000);
                    }
                },
                _messageToDesktop: function () {
                    if (canDesktopNotify === true) {
                        var output = '';
                        var countMessage = 0;
                        var MessageinRooms = MessageText.getMessageInbox();
                        _.forEach(MessageinRooms,function(room){
                            _.forEach(room,function(mesage){
                                countMessage++;
                                output+= PhoneBook.getClient(mesage.user).label + ":\n"
                                        + mesage.text + "\n";
                            });
                        });
                        if(countMessage > 3) {
                            output = 'You have more than 3 new messages';
                        }
                        new Notification('New Messages',
                            {
                                body: output,
                                tag: 'unreadMessage'
                            });
                    }
                },
                _initVibration : function () {
                    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
                    if (navigator.vibrate) {
                        canVibration = true;
                    }
                },
                _initDesktopNotification: function () {
                    if (Notification) {
                        Notification.requestPermission(function () {
                            canDesktopNotify = true;
                        });
                    }
                },

                /**
                 * @ngdoc methode
                 * @name visibilitychanged
                 * @methodOf unchatbar.Notify
                 * @description
                 *
                 * visibility change
                 *
                 */
                visibilitychanged: function () {
                    var hidden = document.hidden || document.webkitHidden || document.mozHidden || document.msHidden;
                    isHidden = hidden || false;
                }
            };
            return api;
        }
    ]
);
