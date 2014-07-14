---
page_title_show: true
title: "Control robots from your pebble"
page_title: Blog
date: 2014-07-07
tags: robots
author: Javier Cervantes
active_menu_blog: true
---

:markdown
  Have you ever wanted to control robots from your watch? This is now possible,
  thanks to Cylon's [Pebble][] support.

  Using our [WatchBot][] app, you can very easily send notifications, receive
  events, and access accelerometer data.

  ### How Does It Work?

  Once you've loaded [WatchBot][] onto your Pebble, it will communicate directly
  with the Cylon API, and use this to send commands and receive events.

  ![watchbot](http://watchbot.io/images/infographic.png)

  ### Get Started

  Getting started with Cylon.js and Pebble is easy, all you need to do is install
  the cylon-pebble module:

      $ npm install cylon-pebble

  With that done, download WatchBot from the [Pebble App Store][].

  ### Configuration

  Once you've got WatchBot installed, go to "My Pebble" on your smartphone's
  Pebble app. Once there, configure the following settings:

  - **robot name:** leave this blank.
  - **robot api host:** IP address of the computer that will be running the Cylon API.
  - **robot api port:** port number for the Cylon API
  - **publish command:** leave this blank
  - **message command:** leave this blank
  - **accelerometer:** leave this unchecked.

  ### Examples

  Here's a short example of a Cylon robot your Pebble can talk to:

      :::javascript
      var Cylon = require('cylon');

      Cylon.api({
        host: '0.0.0.0',
        port: '8080',
        ssl:  false
      });

      Cylon.robot({
        name: 'pebble',

        connection: { name: 'pebble', adaptor: 'pebble'  },
        device: { name: 'pebble', driver: 'pebble'  },

        work: function(my) {
          my.pebble.send_notification("Hello Pebble!");

          my.pebble.on('button', function(data) {
            console.log("Button pushed: " + data);
          });

          my.pebble.on('tap', function(data) {
            console.log("Tap event detected");
          });
        }
      }).start();

  Re-open the WatchBot app on your Pebble (to update it with the new settings),
  and run this example. Your Pebble will now get a notification, and Cylon will
  log when your Pebble registers a button press or tap.

  For more fun, let's track accelerometer data from the Pebble with Cylon:

      :::javascript
      var Cylon = require('cylon');

      Cylon.api({
        host: '0.0.0.0',
        port: '8080',
        ssl:  false
      });

      Cylon.robot({
        name: 'pebble',

        connection: { name: 'pebble', adaptor: 'pebble'  },
        device: { name: 'pebble', driver: 'pebble'  },

        work: function(my) {
          my.pebble.on('accel', function(data) {
            console.log(data);
          });
        }

      }).start();

  Before running this example, be sure to go to the WatchBot settings, turn
  accelerometer support on, and reopen WatchApp.

  When you run this example, Cylon will begin logging your Pebble's accelerometer
  data to the screen.

  This is just the start. Now your Pebble can be used to interact with any of the
  20 other platforns Cylon.js currently supports. For more info about the Pebble
  support, please check out the [docs][]. And check out the [platforms][] page
  for info on the other hardware we support.

  Build something cool? Want to let us know? Just want to see what we're up to?
  Follow us on Twitter - [@CylonJS][]

  [@CylonJS]: https://twitter.com/cylonjs
  [Pebble App Store]: https://apps.getpebble.com/applications/52b11885b0661fb292000004
  [Pebble]: http://getpebble.com
  [WatchBot]: http://watchbot.io
  [docs]: http://cylonjs.com/documentation/platforms/pebble
  [platforms]: http://cylonjs.com/documentation/platforms
