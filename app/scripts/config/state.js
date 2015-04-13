'use strict';
angular.module('unchatbar')
    .config(['$stateProvider', '$locationProvider',
        function ($stateProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/peer/login.html'
                })
                .state('layoutChat', {
                    abstract: true,
                    templateUrl: 'views/peer/dashboard.html'
                })
                .state('index', {
                    parent: 'layoutChat',
                    url: '/',
                    views: {
                        header: {
                            templateUrl: 'views/peer/dashboard/header.html'
                        },
                        sidebar: {
                            templateUrl: 'views/peer/dashboard/sidebar.html'
                        },
                        content: {
                            templateUrl: 'views/peer/dashboard/chat.html'
                        },
                        footer: {
                            templateUrl: 'views/peer/dashboard/footer.html'
                        }
                    }
                })
                .state('profile', {
                    parent: 'layoutChat',
                    url: '/profile', views: {
                        header: {
                            templateUrl: 'views/peer/dashboard/header.html'
                        },
                        sidebar: {
                            templateUrl: 'views/peer/dashboard/sidebar.html'
                        },
                        content: {
                            templateUrl: 'views/peer/dashboard/profile.html'
                        },
                        footer: {
                            templateUrl: 'views/peer/dashboard/footer.html'
                        }
                    }
                })
                .state('contact', {
                    url: '/contact',
                    parent: 'layoutChat',
                    views: {
                        header: {
                            templateUrl: 'views/peer/dashboard/header.html'
                        },
                        sidebar: {
                            templateUrl: 'views/peer/dashboard/sidebar.html'
                        },
                        content: {
                            templateUrl: 'views/peer/dashboard/chat.html'
                        },
                        footer: {
                            templateUrl: 'views/peer/dashboard/footer.html'
                        }
                    }
                })
                .state('contact.client', {
                    parent: 'contact',
                    url: '/user/{clientId}'

                })
                .state('contact.group', {
                    parent: 'contact',
                    url: '/group/{groupId}'

                })
                .state('channel', {
                    parent: 'contact',
                    url: '/{channel}',
                    resolve:{
                        getPeerId: ['$stateParams','PhoneBook',function( $stateParams,PhoneBook){
                            $stateParams.clientId = PhoneBook.getClientByChannel($stateParams.channel).id || null;
                            $stateParams.groupId = PhoneBook.getGroupByChannel($stateParams.channel).id || null;
                        }]
                    }
                });
        }
    ]);