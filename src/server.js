const express = require('express');
const SerialPort = require('serialport');
const Gpio = require('onoff').Gpio;
const app = express();

console.log("Running program as: " + require("os").userInfo().username);

let intervalId = 0,
    intervalMs = 800,
    ledState = false;
    led = new Gpio(23, 'out');

app.get('/', (req, res) => {
    var links = '<a href="/blink/on">Enable LED</a> | <a href="/blink/off">Disable LED</a>';
    res.send('Garage door opener says Hello world! <br />' + links);
});

app.get('/blink/on', (req, res) => {
    startBlinking();
    res.send("LED blinking enabled on period of " + intervalMs + "ms.");
});

app.get('/blink/off', (req, res) => {
    stopBlinking()
    res.send("LED blinking is disabled.");
})

app.listen(1337, () => console.log("Garage door server is listening on port 1337"));

process.on('SIGINT', function () {
    led.unexport();
  });

function startBlinking() {
    intervalId = setInterval(() => {
        ledState = !ledState;
        let value = + ledState;
        led.writeSync(value);
    }, intervalMs);
}

function stopBlinking() {
    clearInterval(intervalId);

    ledState = false;

    led.writeSync(0);
}