---
page_title_show: true
title: "Using Socket.io with Cylon.js"
page_title: Blog
date: 2015-02-05
tags: robots socket.io api plugin
author: Edgar Silva
active_menu_blog: true
---
In the latest release of Cylon.js, we made a big change to how the built-in API was implemented: we removed the API from the core Cylon.js module. Instead, we have implemented a simple plug-in system for API modules. This gives several advantages, like a smaller file size for the base `cylon` module if you do not need the API. It allows you to only use the interfaces you actually need. We have also tried to make it easy to implement new interfaces, just by adding new API plugins. 

We currently have two different API plugins to choose from, [cylon-api-http](https://github.com/hybridgroup/cylon-api-http) and [cylon-api-socketio](https://github.com/hybridgroup/cylon-api-socketio). The "http/https" API plugin is used to service REST-style API calls into Cylon.js, as well as supporting the [Robeaux](http://robeaux.io) web user interface.

The newest API plugin, and what this post is about, is `cylon-api-socketio`, which as the name suggests adds support for the [socket.io](http://socket.io/) module. This makes it easy to command or retrieve data from a Cylon.js robot, simply by using a socket.io client such as a browser-based application.

## Executing Device Commands And Listening For Events

First, you must make sure everything is installed. This is pretty simple. As with any other Cylon.js module,
you first install `cylon`. Then install `cylon-api-socketio`, like this:

    :::bash
    $ npm install cylon
    $ npm install cylon-api-socketio

### Creating The Robot and Setting Up The API

We declare our robot as usual using Cylon.js. Once this is done we can add our `Cylon.api()` call in our code, and then
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

The example above would be our "server" side program, which is in charge of handling all of the API socket connections. It creates and sets up the appropriate socket.io server listener. Once a user connects to the main Cylon.js socket, it creates sockets for the robots and devices, and sets up the appropriate routes, namespaces and listeners. Once you have connected, issuing commands and listening for events is pretty easy.

### Connecting To A Socket and Sending Commands

In the following example, we will connect to the robot defined above, and then make an LED blink by sending a command to the `led` device from a client running in the browser.

First, run the `blink-server` program and wait for the work block to start. Then save the following html code in a file (`blink-client.html`) and open it in a browser:

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

You should see the built-in LED in your Arduino start blinking. The commands to tell the LED to blink, are all being sent from the browser to the robot, using the device socket we created and then calling `device.emit('toggle');`.

All of the device commands and events you can use in a regular Cylon.js program are available to the device socket. Now, let's learn how to listen for events.

### Listening For Robot Or Device Events In A Socket

We'll dial up the complexity a little bit, by using custom robot commands and events. It is worth mentioning that you can listen to any device-emitted event in the same fashion, but by connecting to the device socket instead.

As with the previous example, we start by defining our robot and setting up the Socket.io API. Here's how we add the custom commands and events:

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


Let's go over the code above. First, we define a new robot and add `events` to it. The API plugin will register listeners for these events.

Then we define custom commands that will be available to the API. As you can see, defining commands is slightly different, but this is for a good reason. This way you can create aliases for your robot methods more easily. You can also just define methods in your robot and omit the `commands` definition, in
which case all of the methods added to the robot would be available to the API. We prefer this more explicit way of doing it, which gives you more control over what you are exposing to the API.

Now, let's take a look at the client side of this example:

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

In the above example, we start by connecting to the robot namespace. In Cylon.js all of out API routes (or API namespaces, in this case) start at the `/api` level. From there we can connect to a specific robot, simply by providing the robot's entire namespace, in this case `/api/robots/chappie`.

We then add a couple of listeners. First, one for the default `message` event that you can use to check socket connectivity to the robot. Then two more for the two custom events that we defined in our `robot-events-server` program.

Finally we setup a time interval to make the LED blink, but in this case we are do it by calling/sending one of the custom commands we defined in the robot.

As you can see, the possibilities for what you can do with this are enormous! You could add sensors to your robot and monitor in real-time, fly a drone from your browser, or connect to one robot, then trigger functionality in another robot, based on real-time sensor data, just to name a few.

We hope you find this blog post on how to use Socket.io with Cylon.js useful, and don't forget to check our [API](/documentation/api/socket-io) docs for more detailed information.

## Follow us on Twitter

For more updates, be sure to follow us on Twitter at [@CylonJS].

[@CylonJS]: https://twitter.com/CylonJS
[cylon-api-socketio]: https://github.com/hybridgroup/cylon-api-socketio
[cylon-api-http]: https://github.com/hybridgroup/cylon-api-http
