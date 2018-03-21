const EventEmitter = require('events').EventEmitter;

class Observer extends EventEmitter {
    constructor() {
        super(this);
    }
}

module.exports = Observer;