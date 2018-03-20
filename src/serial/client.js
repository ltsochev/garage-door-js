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
        })
    }

    shutdown() {

    }
}

module.exports = SerialClient;