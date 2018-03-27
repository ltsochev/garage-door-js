const config = require('../config.js');
const SerialPort = require('serialport');
const EventEmitter = require('events').EventEmitter;

class SerialClient extends EventEmitter {
    constructor(server) {
        super();
        this.open = false;
        this.server = server;
        this.port = config.serial.port;
        this.baudRate = config.serial.baud_rate;
        
        this.serialPort = new SerialPort(this.port, {
            baudRate: this.baudRate
        }, (err) => {
            if (err) {
                this.open = false;
                return console.error("Serial Error: ", err.message);
            }
        });

        this.init();
    }

    init() {
        let self = this;

        this.serialPort.on('open', () => self.open = true);
        this.serialPort.on('data', (data) => { self.emit('serial.recv', data); });
    }

    send(message) {
        this.serialPort.write(message, (err) => {
            if (err) {
                console.error('Eror or serial write: ', err.message());
            }

            console.log('data sent.');
        });
    }

    isRunning() {
        return this.open;
    }

    shutdown() {
        this.open = false;
        this.serialPort.close();
    }
}

module.exports = SerialClient;