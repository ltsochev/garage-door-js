let config = {};

config.serial = {};
config.pins = [];
config.web = {};
config.blinker = {}
config.security = {};

config.web = {
    listen: 1337,
    key: "JI6MOz3K9zDnTVOpz28sz4e163A42seW"
}

config.pins.push({id: 23, defaultValue: 0, direction: 'out', edge: 'none'});

config.serial = {
    port: '/dev/ttyAMA0',
    baud_rate: 9600
}

config.blinker = {
    pin: 23,
    interval: 200
}

config.security = {
    hash: 'I1QA0FA0VZMCRE2DZU458ZXJBRG1EV6UF0D9TF8B',
    sigParam: 'cid'
}

module.exports = config;
