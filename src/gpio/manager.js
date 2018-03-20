"use strict"

let config = require('../config.js');
const GpioPin = require('./pin.js');

class GpioManager {
    constructor() {
        this.pins = [];
        this.initPins();
    }

    initPins() {
        let pins = config.pins;
        
        for(let i = 0; i < pins.length; i++) {
            let pin = pins[i];

            try {
                let gpioPin = new GpioPin(pin);
                this.pins.push(gpioPin);
            } catch(e) {
                console.error(e.name + ': ' + e.message);
            }
        }
    }

    getPin(id) {
        for(let i = 0; i < this.pins.length; i++) {
            let pin = this.pins[i];

            if (pin.id == id) {
                return pin;
            }
        }
    }

    shutdown() {
        for(let i = 0; i < this.pins.length; i++) {
            let pin = this.pins[i];
            
            try {
                pin.unexport();
            } catch(e) {
                console.error(e.name + ': ' + e.message);
            }
        }
    }
}

module.exports = GpioManager;