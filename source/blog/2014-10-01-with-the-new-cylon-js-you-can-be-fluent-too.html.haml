---
page_title_show: true
title: "With The New Cylon.js 0.19.0, You Can Be Fluent Too"
page_title: Blog
date: 2014-10-01
tags: robots
author: Andrew Stewart
active_menu_blog: true
---
:markdown
  We've just finished cutting Cylon.js `0.19.0`, another big step forward leading to our `1.0.0` release.
  There are a number of exciting, yet potentially-breaking interface changes; particularly for module developers.
  But don't fear!
  We're here to let you know what these changes are and what else is new.

  ### For Application Developers

  - Fluent syntax - Useful to those familiar with jQuery or similar frameworks.
    You can choose which syntax you prefer based on your specific application scenario, either the new fluent style, or the current declarative style.
    Here is an example of a Arduino-based robot, written in the fluent syntax:

        :::javascript
        var cylon = require('cylon');

        cylon.robot({
          connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
          devices: [
            { name: 'led', driver: 'led', pin: 13 },
            { name: 'button', driver: 'button', pin: 2 }
          ]
        })
        .on('ready', function(bot) {
          bot.button.on('push', function() {
            bot.led.toggle();
          });
        })
        .on('error', function(err) {
          console.log(err);
        })
        .start();

    This is how the same example looks with the current declarative syntax:

        :::javascript
        var Cylon = require('cylon');

        Cylon.robot({
          connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
          devices: [
            { name: 'led', driver: 'led', pin: 13 },
            { name: 'button', driver: 'button', pin: 2 }
          ],
          work: function(bot) {
            bot.button.on('push', function() {
              bot.led.toggle();
            });
          },
          error: function(err) {
            console.log(err);
          }
        }).start();

    See what we mean? You can now choose the best syntax for your preferred style of code. Have it your way!

  - Configuration with `Cylon#configure(obj)`.
    This method takes an object as an argument, and merges it with Cylon's interal configuration.
    It then returns the current configuration.

  - API configuration has been moved to the `Cylon#configure` block.
    `Cylon#api()` will now start an API instance with the current configuration.

  - Auto-start mode - Cylon can now automatically start robots for you, as soon as they're instantiated.
    To enable this behaviour, enable it in the configuration - `Cylon.config({ mode: 'auto' })`.

  - No more name collisions - Cylon will now automatically rename Devices, Connections, and Robots if they'd conflict with the name of an existing object.

  - Adjustable halt timeout - by default, Cylon will automatically hard-terminate if it can't gracefully shut down inside 3 seconds.
    This timeout is adjustable in config as `haltTimeout` in milliseconds.

  ### For Platform Developers

  - Adaptor `#connect`/`#disconnect` + Driver `#start`/`#halt` methods now take a callback.
    The `#halt`/`#disconnect` methods _must_ be implemented in Adaptor/Driver subclasses, and trigger the provided callback when they're done their own work.
    This is to help ensure Cylon can shut down efficiently and safely.

  - Methods are automatically proxied from Adaptors -> Connections and Drivers -> Devices.
    You no longer have to manually provide an Adaptor commands array.

  - `Driver` subclasses will now receive a default interval of 1000ms.
    This is adjustable by users in the device configuration hash.

  - Direct Adaptor access inside Drivers - inside Driver subclasses, instances will now have direct access to the Adaptor they're communicating with under `this.adaptor`.

  - For Test Driven Robotics (TDR) and inside the Robot class, testing mode is now triggered by `NODE_ENV` rather than a global variable.

  ### More Hardware Support

  Of course, no Cylon.js release would be complete without some new hardware platform updates, so we've added support for the [Phillips Hue](http://meethue.com) wireless lighting system with [cylon-hue](https://github.com/hybridgroup/cylon-hue), as well as updating [cylon-spark](https://github.com/hybridgroup/cylon-spark) to use the new [Spark.js](https://github.com/spark/sparkjs) library with the [Spark Core](https://www.spark.io/) wireless microcontroller.

  We are really excited about this big update to Cylon.js, and we hope you are too. It is now just that much easier to create robots and connected devices.

  For more updates, be sure to follow us on Twitter at [@CylonJS][].

  [@CylonJS]: https://twitter.com/cylonjs
