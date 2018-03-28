let Gpio = require('onoff').Gpio;

class Pin {
    constructor(config) {
        this.pinId = config.id;
        this.direction = config.direction;
        this.edge = config.edge;
        this.unexported = false;
        this.labelStr = config.label || config.id;

        this.gpio = new Gpio(this.pinId, this.direction, this.edge);
        this.write(config.defaultValue);
    }

    get id() {
        return this.pinId;
    }

    get label() {
        return this.labelStr;
    }
    
    toggle() {
        this.write(this.read() ^ 1);
    }

    write(value) {
        this.gpio.writeSync(value);
    }

    read() {
        return this.gpio.readSync();
    }

    direction(newDirection) {
        this.gpio.setDirection(newDirection);
    }

    edge(newEdge) {
        this.gpio.setEdge(newEdge);
    }

    unexport() {
        if (this.unexported === true) {
            throw new Error("Pin " + this.pinId + " has already been unexported.");
        }

        this.unexported = true;
        this.gpio.unexport();
    }
}

module.exports = Pin;