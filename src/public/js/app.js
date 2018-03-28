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
        var time = new Date(msg.time);
        var str = ["Server Time: " + time.toTimeString()]
        str.push("Gate State: " + msg.gate);
        str.push("Bluetooth State: " + msg.serial);
        str.push("Users Connected: " + msg.users);
        
        $('#server-status').text(str.join(', '));
    });

    socket.on('serial.recv', function(data) {
        console.log(data);
        $('#serial-response').text(data);
    });

    socket.on('relay.toggle', function() {
        console.log(arguments);
    });

    setInterval(function() {
        socket.emit('latency', Date.now(), function(startTime) {
            var latency = Date.now() - startTime;
            var latencyStr = latency + 'ms.';

            $('#ping').text('Ping: ' + latencyStr);

        })
    }, 2000);

    $('#serial-form').submit(function(e) {
        e.preventDefault();

        var $input = $('#serialInput'),
            serialData = $input.val();
        
        $input.val('');

        socket.emit('serial.send', serialData, function(res) {
            $('#serial-response').text(res);
        });
    });

    $('#relay-controller').find('button').click(function(e) {
       var $this = $(this),
            relay = $this.data('relay');
        
        socket.emit('relay.toggle', relay, function(res) {
            console.log(res);
        });
    });

})(jQuery, window.axios, io);