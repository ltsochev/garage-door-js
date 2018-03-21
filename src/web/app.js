const path = require("path");
const express = require('express');
const config = require('../config.js');
const EventEmitter = require('events').EventEmitter;

class WebApp extends EventEmitter {
    constructor(server, gpioManager) {
        super();
        this.gpioManager = gpioManager;
        this.secretKey = config.web.key;
        this.bindPort = config.web.listen;
        this.server = server;
        this.httpServer;
    
        let publicPath = path.join(__dirname, "../public");
        this.app = express();
        this.app.use('/public', express.static(publicPath));

        this.registerRoutes();
        this.beginListen();
    }

    registerRoutes() {
        this.app.get('/', this._getHomePage);
        this.app.get('/blink/on', this._getBlinkOn.bind(this));
        this.app.get('/blink/off', this._getBlinkOff.bind(this));
    }

    beginListen() {
        this.httpServer = this.app.listen(this.bindPort, this._onBindHandler.bind(this));
    }

    _onBindHandler() {
        console.log("Web server is running port: " + this.bindPort);
    }

    _getHomePage(req, res) {
        res.sendFile(path.join(__dirname + '/../views/dashboard.html'));
    }

    _getBlinkOn(req, res) {
        this.emit('blinker.on');
        res.redirect('/');
    }

    _getBlinkOff(req, res) {
        this.emit('blinker.off');
        res.redirect('/');
    }

    shutdown() {
        console.log("Shutting down web server.");

        if (this.httpServer) {
            this.httpServer.close(() => console.log('Finished all HTTP requests.'));
        }
    }
}

module.exports = WebApp;