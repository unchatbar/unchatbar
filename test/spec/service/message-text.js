'use strict';

describe('Serivce: Broker', function () {
    var BrokerService, sessionStorage, MessageTextService, PhoneBookService, ConnectionService;



    beforeEach(inject(function (MessageText, Broker, $sessionStorage, PhoneBook, Connection) {
        MessageTextService = MessageText;
        BrokerService = Broker;
        sessionStorage = $sessionStorage;
        PhoneBookService = PhoneBook;
        ConnectionService = Connection;
    }));

    describe('check methode', function () {


    });
})
;