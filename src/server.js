const GpioManager = require('./gpio/manager.js');
const WebApp = require('./web/app.js');
const config = require('./config.js');
const appUser = require("os").userInfo().username;

console.log("Attempting to run program as: " + appUser);
if (appUser != 'root') {
    console.warn("You might face issues with GPIO export unless you run this software as 'root'.");
}

let manager = new GpioManager();
let webServer = new WebApp(manager);
let blinkerIntervalId = 0;

webServer.on('blinker.on', startBlinking);
webServer.on('blinker.off', stopBlinking);

/*
let commandProcessor = new CommandProcessor(manager, webServer, serialClient)
*/

process.on('SIGINT', () => {
    manager.shutdown();
    webServer.shutdown();
    // commandProcessor.shutdown();

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