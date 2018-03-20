const express = require('express');
const SerialPort = require('serialport');
const onoff = require('onoff');

const app = express();

app.get('/', (req, res) => {
    res.send('Garage door opener says Hello world!');
});

app.listen(1337, () => console.log("Garage door server is listening on port 1337"));