/**
 * @ngdoc controller
 * @name  unchatbar.controller:phoneBook
 * @require $scope
 * @require broker
 * @description
 *
 * show all client connections
 * #controller of this directive
 * #{@link unchatbar.clientCalled directive}
 *
 */
angular.module('unchatbar').controller('phoneBook', ['$scope','DataConnection','PhoneBook',
    function ($scope,DataConnection,PhoneBook) {
        /**
         * @ngdoc property
         * @name username
         * @propertyOf unchatbar.controller:phoneBook
         * @returns {Object} clientList map of all client connections
         */
        $scope.clientList = PhoneBook.getMap();

     
        /**
         * @ngdoc methode
         * @name removeClient
         * @methodOf unchatbar.controller:phoneBook
         * @params  {String} peerId id of client
         * @description
         *
         * remove client from phone book list
         *
         */
        $scope.removeClient = function (peerId) {
            if (PhoneBook.remove(peerId)) {
                $scope.clientList = PhoneBook.getMap();
            }
        };

        /**
         * @ngdoc methode
         * @name removeClient
         * @methodOf unchatbar.controller:phoneBook
         * @params  {String} peerId id of client
         * @description
         *
         * create connection to client
         *
         */
        $scope.connectClient = function (peerId) {
            DataConnection.connect(peerId);
        };

        $scope.$on('peer:clientConnect', function (event, data) {
            $scope.clientList = PhoneBook.getMap();
        });

    }
]);