'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar.controller:unChat
 * @require $scope
 * @require $stateParams
 * @require PhoneBook
 * @description
 *
 * client controller
 *
 */
angular.module('unchatbar')
  .controller('unChat', ['$scope', '$stateParams', '$state', 'Broker', 'PhoneBook', 'Profile',
    function ($scope, $stateParams, $state, Broker, PhoneBook, Profile) {

      /**
       * @ngdoc property
       * @name showSidebar
       * @propertyOf unchatbar.controller:unChat
       * @returns {Boolean} shoud show sidebar
       */
      $scope.showSidebar = false;

      /**
       * @ngdoc property
       * @name currentStateName
       * @propertyOf unchatbar.controller:unChat
       * @returns {String} name current state
       */
      $scope.currentStateName = '';

      /**
       * @ngdoc property
       * @name clientMap
       * @propertyOf unchatbar.controller:unChat
       * @returns {String} name of channel
       */
      $scope.channel = '';

      /**
       * @ngdoc property
       * @name selectedContactType
       * @propertyOf unchatbar.controller:unChat
       * @returns {Object} selected contact type
       */
      $scope.selectedContactType = {
        user: true,
        group: false
      };

      /**
       * @ngdoc property
       * @name stateName
       * @propertyOf unchatbar.controller:unChat
       * @returns {String} current state name
       */
      $scope.stateName = '';

      /**
       * @ngdoc property
       * @name clientFromChannelMap
       * @propertyOf unchatbar.controller:unChat
       * @returns {Array} list of clients
       */
      $scope.clientFromChannelMap = '';

      /**
       * @ngdoc property
       * @name clientMap
       * @propertyOf unchatbar.controller:unChat
       * @returns {Object} client map from phone-book
       */
      $scope.clientMap = {};

      $scope.showUnreadMessageList = false;

      /**
       * @ngdoc methode
       * @name getClientAllClients
       * @methodOf unchatbar.controller:unChat
       * @params  {String} peerId id of client
       * @description
       * *
       * get all clients from phone book
       *
       */

      $scope.getClientAllClients = function () {
        $scope.clientMap = PhoneBook.getClientMap();

      };

      /**
       * @ngdoc methode
       * @name getClientsFromChannel
       * @methodOf unchatbar.controller:unChat
       * @description
       * *
       * get user map from channel
       *
       */

      $scope.getClientsFromChannel = function () {
        if ($stateParams.groupId) {
          var users = PhoneBook.getGroup($stateParams.groupId).users;
          $scope.clientFromChannelMap = {};

          _.forEach(users, function (user) {
            if (user.id !== Broker.getPeerId()) {
              $scope.clientFromChannelMap[user.id] = PhoneBook.getClient(user.id);
            } else {
              $scope.clientFromChannelMap[user.id] = Profile.get();
            }
          });
        } else if ($stateParams.clientId) {
          $scope.clientFromChannelMap = {};
          $scope.clientFromChannelMap[$stateParams.clientId] = PhoneBook.getClient($stateParams.clientId);
          $scope.clientFromChannelMap[Broker.getPeerId()] = Profile.get();
        }
      };

      /**
       * @ngdoc methode
       * @name getChannel
       * @methodOf unchatbar.controller:unChat
       * @description
       *
       * get channel from phone-book
       *
       */
      $scope.getChannel = function () {
        $scope.channel = $stateParams.channel;
      };

      /**
       * @ngdoc methode
       * @name init
       * @methodOf unchatbar.controller:unChat
       * @description
       *
       * init controller
       *
       */
      $scope.init = function () {
        $scope.getChannel();
        $scope.getClientsFromChannel();
        $scope.getClientAllClients();
        $scope.showSidebar = false;
        $scope.currentStateName = $state.$current.name;
      };

      $scope.$on('PhoneBookUpdate', function () {
        $scope.init();
      });

      $scope.$on('$stateChangeSuccess', function () {
        $scope.stateName = $state.current.name;
        $scope.init();

      });


    }
  ]);
