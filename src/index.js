"use strict"

const Server = require('./server.js');

let app = new Server();

process.on('SIGINT', () => {
    app.close();
    process.exit(0);
});