---
page_title_show: true
title: "Using Socket.io with Cylon.js"
page_title: Blog
date: 2015-02-05
tags: robots socket.io api plugin
author: Edgar Silva
active_menu_blog: true
---
In the latest release of Cylon.js API plugins were stripped from the main module, this gives some
advantages like a lighter `cylon` module if you do not need the API and makes it easier to implement
and add new API plugins. We now have two different plugins to choose from depending on your needs,
[cylon-api-http](https://github.com/hybridgroup/cylon-api-http) and [cylon-api-socketio](https://github.com/hybridgroup/cylon-api-socketio).

For this entry we'll focus on the newest adition `cylon-api-socketio`, wich as the name suggests ads
support for the Socket.io module.

## Executing device commands and listening for events

First make sure everything is installed, instalation is pretty simple as with any other cylon module,
you need to first install `cylon` and then install `cylon-api-socketio`.

    :::bash
    $ npm install cylon
    $ npm install cylon-api-socketio

### Creating the robot and settingup up the API

We create our robot as usual using cylon, once this is done we can add our `Cylon.api()` call in our code,
finally we start the work.

`blink-server.js`

    :::javascript
    'use strict';

    // We require cylon and define our robot as usual
    var Cylon = require('cylon');

    Cylon.robot({
      name: 'chappie',

      connections: {
        arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
      },

      devices: {
        led: { driver: 'led', pin: 13 }
      },

      work: function() {
        // Add your robot code here,
        // for this example with socket.io
        // we are going to be interacting
        // with the robot using the code in
        // the client side.
      }
    });

    // We setup the api specifying `socketio`
    // as the preffered plugin
    Cylon.api(
      'socketio',
      {
      host: '0.0.0.0',
      port: '3000'
    });

    Cylon.start()

The example above would be our "server" side program, which is in charge of handling all of the
API socket connections; it creates and setups the appropiate MCP sockets. Then when a user connects
to the the cylon socket it creates sockets for the robots and devices, and sets up the appropiate
routes, namespaces and listeners. Once you have connected, issuing commands and listening for events
is pretty easy.

### Connecting to a socket and sending commands

In the following example we connect to the robot defined above and make an LED blink by sending a
command to the `led` device we setup in the robot, all of this running in the browser.

We run the `blink-server` program and wait for the work block to start. Then save the following
html code in a file (`blink-client.html`) and we open it in a browser.

`blink-client.js`

    :::javascript
    <!doctype html>
    <html>
      <meta charset="utf-8">
      <head>
        <title>Socket.IO chat</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font: 13px Helvetica, Arial; }
          form {
            background: #000; padding: 3px; position: fixed;
            bottom: 0; width: 100%;
          }
          form input {
            border: 0; padding: 10px; width: 90%;
            margin-right: .5%;
          }
          form button {
              width: 9%; background: rgb(130, 224, 255);
              border: none; padding: 10px;
          }
          #messages { list-style-type: none; margin: 0; padding: 0; }
          #messages li { padding: 5px 10px; }
          #messages li:nth-child(odd) { background: #eee; }
        </style>
      </head>
      <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
      <script src="http://code.jquery.com/jquery-1.11.1.js"></script>
      <script type="text/javascript">
        var device;

        window.onload = function() {
          // We connect to the device defined in the robot
          device = io('http://127.0.0.1:3000/api/robots/chappie/devices/led');

          // Listen to the 'message' event on device
          device.on('message', function(msg) {
            $('#messages').append($('<li>').text(msg));
          });

          // The "hello world" program of robotics, the
          // blink and LED program, we just emit the command
          // we want our device to execute.
          setInterval(function() {
            device.emit('toggle');
          }, 1000);

          msg = 'You have been subscribed to Cylon socket: ' + device.nsp;

          $('#messages').append($('<li>').text(msg));

          $('form').submit(function(){
            device.emit('message', $('#m').val());
            $('#m').val('');

            return false;
          });
        };
      </script>
      <body>
        <ul id="messages"></ul>
        <form action="">
          <input id="m" autocomplete="off" /><button>Send</button>
        </form>
      </body>
    </html>

You should see the led in your arduino start blinking, the commands to blink the led
are all being send from the browser to the robot using the device socket we created and
calling `device.emit('toggle');`.

All device's commands and events you can use in a regular cylon program are available to the
device socket. Let's check how to listen for events.

### Listening for robot/device events in a socket

We'll dial up the complexity a little bit by using custom robot commands and
events this time, it is worth mentioning that you can listen to any device
emitted event in the same fashion, but connecting to the device socket instead.

As with the previous example we start by defining our robot and setting up
the Socket.io API. Here we'll add the custom commands and events.

`robot-events-server.js`

    :::javascript
    'use strict';

    var Cylon = require('cylon');

    Cylon.robot({
      name: 'chappie',

      // This is how we define custom events that will be registered
      // by the API.
      events: ['turned_on', 'turned_off'],

      // These are the commands that will be availble in the API
      // Commands method needs to return an object with the aliases
      // to the robot methods.
      commands: function() {
        return {
          turn_on: this.turnOn,
          turn_off: this.turnOff,
          toggle: this.toggle
        };
      },

      connections: {
        arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
      },

      devices: {
        led: { driver: 'led', pin: 13 }
      },

      work: function() {
        // We setup two time outs to turn on
        // and turn off the led device.
        // this will trigger an event that
        // we'll to listen to in the client
        after((2).seconds(), function() {
          this.turnOn();
        }.bind(this));

        after((5).seconds(), function() {
          this.turnOff();
        }.bind(this));
      },

      turnOn: function() {
        this.led.turnOn();
        this.emit('turned_on');
      },

      turnOff: function() {
        this.led.turnOff();
        this.emit('turned_off');
      },

      toggle: function() {
        this.led.toggle();
        if (this.led.isOn()) {
          this.emit('turned_on');
        } else {
          this.emit('turned_off');
        }
      }
    });

    Cylon.api(
      'socketio',
      {
      host: '0.0.0.0',
      port: '3000'
    });

    Cylon.start();


Let's go over the code above, we define a new robot and add `events` to it,
these events are the ones the API plugin will register listeners for.

Then we define custom commands that will be available to the API,
as you can see the definition of commands is slightly different, but this is
for a reason, this way you create aliases your robot methods more easily. You could
also just define methods in your robot and omit the `commands` definition, in
that case all of the methods added to the robot would be available to the API, but
we preffer this more explicit way of doing it.

Now let's take a look at the client side of this example.

`robot-events-client.js`

    :::html
    <!doctype html>
    <html>
      <meta charset="utf-8">
      <head>
        <title>Socket.IO chat</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font: 13px Helvetica, Arial; }
          form { background: #000; padding: 3px;
            position: fixed; bottom: 0; width: 100%; }
          form input { border: 0; padding: 10px; width: 90%;
            margin-right: .5%; }
          form button { width: 9%; background: rgb(130, 224, 255);
            border: none; padding: 10px; }
          #messages { list-style-type: none; margin: 0; padding: 0; }
          #messages li { padding: 5px 10px; }
          #messages li:nth-child(odd) { background: #eee; }
        </style>
      </head>
      <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
      <script src="http://code.jquery.com/jquery-1.11.1.js"></script>
      <script type="text/javascript">
        var robot;

        window.onload = function() {
          // We connect to the 'chappie' robot using its namespace(nsp)
          robot = io('http://127.0.0.1:3000/api/robots/chappie');

          // Listen to the 'message' event on the robot
          robot.on('message', function(msg) {
            $('#messages').append($('<li>').text(msg));
          });

          // Listen for robot specific events, this must be declared
          // when defining a robot in cylon
          robot.on('turned_on', function(){
            console.log('The robot "chappie" just turned ON its led!!!');
          });

          robot.on('turned_off', function(){
            console.log('The robot "chappie" just turned OFF its led!!!');
          });

          // The "hello world" program of robotics, the
          // blink and LED program, we accomplish this just
          // by emitting the command we want our robot to execute
          setInterval(function() {
            robot.emit('toggle');
          }, 1000);

          msg = 'You have been subscribed to Cylon sockets:' + robot.nsp;

          $('#messages').append($('<li>').text(msg));

          $('form').submit(function(){
            robot.emit('message', $('#m').val());
            $('#m').val('');

            return false;
          });
        };
      </script>
      <body>
        <ul id="messages"></ul>
        <form action="">
          <input id="m" autocomplete="off" /><button>Send</button>
        </form>
      </body>
    </html>

In the above example we start by connecting to the robot namespace,
in cylon all of out API routes(or API namespaces in this case) start
at the `/api` level, from there we connect to a specific robot by
pproviding the robot's entire namespace, in this case `/api/robots/chappie`.

We then add a couple of listeners, one for the default `message` event that
you can use to check socket connectivity to the robot, and two more for the
two custom events we defined in our `robot-events-server` program.

Finally we setup a time interval to accomplish the same blink LED
functionality, but in this case we are doing it by calling/sending
one of the custom commands we defined in the robot.

As you can see the posibilities and functionality for this is huge,
you could add sensors to your robot and monitor in realtime, fly an ARDrone
from the browser, connect to one robot and trigger funcionality in another
one based on realtime sensor data, just to name a few.

I hope you find this blog post on how to use Socket.io with Cylon.js
useful and don't forget to check our [platforms](/documentation/platforms)
and [API](/api/socket-io/) docs, we are always adding new stuff and
updating the site.

## Follow us on Twitter

For more updates, be sure to follow us on Twitter at [@CylonJS].

[@CylonJS]: https://twitter.com/CylonJS
[cylon-api-socketio]: https://github.com/hybridgroup/cylon-api-socketio
[cylon-api-http]: https://github.com/hybridgroup/cylon-api-http
