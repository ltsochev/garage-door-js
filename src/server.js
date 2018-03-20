const GpioManager = require('./gpio/manager.js');
const WebApp = require('./web/app.js');
const config = require('./config.js');

console.log("Attempting to run program as: " + require("os").userInfo().username);

let manager = new GpioManager();
let webServer = new WebApp(manager);
let blinkerIntervalId = 0;

webServer.on('blinker.on', startBlinking);
webServer.on('blinker.off', stopBlinking);

process.on('SIGINT', () => {
    manager.shutdown();
    webServer.shutdown();

    process.exit(0);
});

function startBlinking() {
    if ( blinkerIntervalId > 0 ) { return; }

    blinkerIntervalId = setInterval(() => {
        let pin = manager.getPin(config.blinker.pin);

        if (pin) {
            pin.write(pin.read() ^ 1);
        }
    }, config.blinker.interval);
}

function stopBlinking() {
    clearInterval(blinkerIntervalId);
}