const SerialClient = require('./serial/client.js');
const CommandProcessor = require('./processor.js');
const GpioManager = require('./gpio/manager.js');
const WebApp = require('./web/app.js');
const config = require('./config.js');
const appUser = require("os").userInfo().username;

class GarageDoorOpenerServer {
    constructor() {
        
        console.log("Attempting to run program as: " + appUser);
        if (appUser != 'root') {
            console.warn("You might face issues with GPIO export unless you run this software as 'root'.");
        }

        this.blinkerIntervalId = null;
        this.manager = new GpioManager(this);
        this.webServer = new WebApp(this, this.manager);
        this.serialClient = new SerialClient(this);
        this.commandProcessor = new CommandProcessor(this);

        this.registerBlinker();
    }

    registerBlinker() {
        this.webServer.on('blinker.on', this._blinkerStart.bind(this));
        this.webServer.on('blinker.off', this._blinkerStop.bind(this));
    }

    _blinkerStart() {
        if (this.blinkerIntervalId) { return console.warn("Blinker is already running"); }

        let self = this;

        this.blinkerIntervalId = setInterval(() => {
            let pin = self.manager.getPin(config.blinker.pin);
            if (pin) {
                pin.write(pin.read() ^ 1);
            }
        }, config.blinker.interval);
    }

    _blinkerStop() {
        clearInterval(this.blinkerIntervalId);
        this.blinkerIntervalId = null;
        let pin = this.manager.getPin(config.blinker.pin);
        if (pin) {
            pin.write(0);
        }
    }

    close() {
        this.manager.shutdown();
        this.webServer.shutdown();
        this.commandProcessor.shutdown();
    }
}

module.exports = GarageDoorOpenerServer;