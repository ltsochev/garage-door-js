"use strict"
const EventEmitter = require('events').EventEmitter;

class CommandProcessor extends EventEmitter {
    constructor(server) {
        super();
        this.server = server;
        this.gpioManager = server.manager;
        this.webServer = server.webServer;
        this.serialClient = server.serialClient;
    }

    shutdown() {

    }
}

module.exports = CommandProcessor;