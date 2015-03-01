'use strict';
angular.module('unchatbar')
    .config(['$stateProvider', '$locationProvider',
        function ($stateProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            $stateProvider
                .state('login', {
                    url: '/login',
                    template: '<un-connection-authentication></un-connection-authentication>'
                })
                .state('layoutChat', {
                    abstract: true,
                    templateUrl: 'views/peer/layout/chat/index.html'
                })
                .state('index', {
                    parent: 'layoutChat',
                    url: '/',
                    views: {
                        header: {
                            templateUrl: 'views/peer/layout/chat/header.html'
                        },
                        sidebar: {
                            templateUrl: 'views/peer/layout/chat/sidebar.html'
                        },
                        content: {
                            templateUrl: 'views/peer/layout/chat/contact-content.html'
                        },
                        footer: {
                            templateUrl: 'views/peer/layout/chat/footer.html'
                        }
                    }
                })
                .state('profileAdmin', {
                    parent: 'layoutChat',
                    url: '/profile', views: {
                        header: {
                            templateUrl: 'views/peer/layout/chat/header.html'
                        },
                        sidebar: {
                            templateUrl: 'views/peer/layout/chat/sidebar.html'
                        },
                        content: {
                            template: '<un-profile-admin></un-profile-admin>'
                        },
                        footer: {
                            templateUrl: 'views/peer/layout/chat/footer.html'
                        }
                    }
                })
                .state('contact', {
                    url: '/contact',
                    parent: 'layoutChat',
                    views: {
                        header: {
                            templateUrl: 'views/peer/layout/chat/header.html'
                        },
                        sidebar: {
                            templateUrl: 'views/peer/layout/chat/sidebar.html'
                        },
                        content: {
                            templateUrl: 'views/peer/layout/chat/contact-content.html'
                        },
                        footer: {
                            templateUrl: 'views/peer/layout/chat/footer.html'
                        }
                    }
                })
                .state('contact.client', {
                    parent: 'contact',
                    url: '/user/{clientId}',
                    views: {
                        selectedContact: {
                            templateUrl: 'views/peer/layout/chat/selected-contact.html'
                        }
                    }
                })
                .state('contact.group', {
                    parent: 'contact',
                    url: '/group/{groupId}',
                    views: {
                        selectedContact: {
                            templateUrl: 'views/peer/layout/chat/selected-contact.html'
                        }
                    }
                });
        }
    ]);