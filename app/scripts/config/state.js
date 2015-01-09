'use strict';
angular.module('unchatbar')
    .config(['$stateProvider','$locationProvider',
        function ($stateProvider,$locationProvider) {
            $locationProvider.html5Mode(true);
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/peer/layout/login.html'
                })
                .state('layoutChat', {
                    abstract: true,
                    templateUrl: 'views/peer/layout/chat/index.html'
                })
                .state('chat', {
                    parent: 'layoutChat',
                    url: '/chat',
                    views: {
                        header: {
                            templateUrl: 'views/peer/layout/chat/header.html'
                        },
                        sidebar: {
                            templateUrl: 'views/peer/layout/chat/sidebar.html'
                        },
                        content: {
                            templateUrl: 'views/peer/layout/chat/content.html'
                        },
                        footer: {
                            templateUrl: 'views/peer/layout/chat/footer.html'
                        }
                    }
                    //templateUrl: 'views/peer/layout/chat/header.html'
                })
                .state('chat.user', {
                    url: '/user/{peerId}',
                    parent: 'chat'

                })
                .state('chat.group', {
                    url: '/group/{groupId}',
                    parent: 'chat'

                })
                .state('chat.profile', {
                    url: '/profile',
                    parent: 'layoutChat',
                    views: {
                        header: {
                            templateUrl: 'views/peer/layout/chat/header.html'
                        },
                        sidebar: {
                            templateUrl: 'views/peer/layout/chat/sidebar.html'
                        },
                        content: {
                            templateUrl: 'views/peer/profile-admin.html'
                        },
                        footer: {
                            templateUrl: 'views/peer/layout/chat/footer.html'
                        }
                    }

                });


        }
    ]);