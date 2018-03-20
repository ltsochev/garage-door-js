"use strict"
const EventEmitter = require('events').EventEmitter;

class CommandProcessor extends EventEmitter {
    constructor(server, manager, webServer, serialClient) {
        super();
        this.server = server;
        this.gpioManager = manager;
        this.webServer = webServer;
        this.serialClient = serialClient;
    }

    shutdown() {

    }
}

module.exports = CommandProcessor;