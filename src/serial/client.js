const SerialPort = require('serialport');
const config = require('../config.js');
const EventEmitter = require('events').EventEmitter;

class SerialClient extends EventEmitter {
    constructor(server) {
        super();
        this.server = server;
        this.port = config.serial.port;
        this.baudRate = config.serial.baud_rate;
        
        this.serialPort = new SerialPort(this.port, {
            baudRate: this.baudRate
        }, (err) => {
            if (err) {
                return console.error("Serial Error: ", err.message);
            }
        });

        this.init();
    }

    init() {
        let self = this;

        this.serialPort.on('data', function (data) { self.emit('serial.recv', data); });
    }

    send(message) {
        this.serialPort.write(message);
    }

    isRunning() {
        return !!this.serialPort;
    }

    shutdown() {
        this.serialPort.close();
    }
}

module.exports = SerialClient;