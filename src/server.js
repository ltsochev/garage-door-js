const SerialClient = require('./serial/client.js');
const CommandProcessor = require('./processor.js');
const GpioManager = require('./gpio/manager.js');
const Signature = require('./security/signature.js');
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
        this.broadcastStatsTimer = null;
        this.signatureGenerator = new Signature(config.security.hash, config.security.sigParam);
        this.manager = new GpioManager(this);
        this.webServer = new WebApp(this, this.manager);
        this.serialClient = new SerialClient(this);
        this.commandProcessor = new CommandProcessor(this);

        this.registerBlinker();

        this.registerSerialClient();

        this.broadcastStatus();
    }

    registerBlinker() {
        this.webServer.on('blinker.on', this._blinkerStart.bind(this));
        this.webServer.on('blinker.off', this._blinkerStop.bind(this));
        this.webServer.on('blinker.enable', this._blinkerEnable.bind(this));
        this.webServer.on('blinker.disable', this._blinkerDisable.bind(this));
    }
    
    registerSerialClient() {
        this.webServer.io.emit('serial.recv', 'Waiting for serial commands.');
        this.serialClient.on('serial.recv', this._serialReceived.bind(this));
    }

    broadcastStatus() {
        if (this.broadcastStatsTimer != null) { return console.warn('Broadcasting is already running.'); }

        let self = this;
        
        this.broadcastStatsTimer = setInterval(() => {
            self.webServer.io.emit('server status', self.getServerStatus());
        }, 1500);
    }

    getServerStatus() {
        return {
            time: new Date(),
            serial: this.serialClient.isRunning() ? 'running' : 'stopped',
            gate: 'closed',
            users: this.webServer.io.engine.clientsCount
        }
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

    _blinkerEnable() {
        this._blinkerStop();
        console.log('Attempting manual enable.');
        this.manager.pinAction(config.blinker.pin, (pin) => pin.write(1));
    }

    _blinkerDisable() {
        console.log('Attempting manual disable.');
        this._blinkerStop();
    }

    _serialReceived(data) {
        console.log('Serial data received: ', data);
        this.webServer.io.emit('serial.recv', data);
    }

    close() {
        this.manager.shutdown();
        this.commandProcessor.shutdown();
        this.webServer.shutdown();
        this.serialClient.shutdown();
    }
}

module.exports = GarageDoorOpenerServer;