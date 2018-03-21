(function($, axios, io) {
    'use strict'

    var $element = $('#blinker-trigger');

    $element.on('mousedown touchstart', function(e) {
        e.preventDefault();

        enableBlinker();
    }).on('mouseup touchend', function(e) {
        e.preventDefault();

        disableBlinker();
    })

    function enableBlinker() {
        axios.post('/blinker/enable')
            .then(function(res) {
                
            }).catch(function(err) {
                console.error(err);
            });
    }

    function disableBlinker() {
        axios.post('/blinker/disable')
            .then(function(res) {

            }).catch(function(err) {
                console.error(err);
            });
    }

    var socket = io();

    socket.on('server status', function(msg) {
        $('#server-status').text(JSON.stringify(msg));
    })

})(jQuery, window.axios, io);