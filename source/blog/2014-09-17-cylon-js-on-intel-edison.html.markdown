---
page_title_show: true
title: Cylon.js on Intel Edison
page_title: Blog
date: 2014-09-17
tags: events
author: Ron Evans & Adrian Zankich
active_menu_blog: true
---

Team Cylon.js was at the Intel Developer Forum in San Francisco last week, and we got our hands on the new Intel Edison boards for the first time. We might have been a little skeptical after the hype of the initial Edison announcement at CES, but once we started working with it, within 24 hours we were very excited about the possibilities.

The Edison is a tiny System on Chip (SoC) board, that is intended to be the main processor for connected devices that include some intelligence inside. It includes dual-core Atom processors, 1GB of RAM, and built-in WiFi/Bluetooth LE, all on a single board with a tiny 70-pin Hirose "stacking connector".

The Hirose connector is one big clue to how Intel plans on the Edison being used: it is the base for a highly customized modular solution, that puts the Edison's GPIO, I2C, UARTs and other capabilities to work in a unique way. The Arduino-compatible breakout board for the Edison, is just for compatibility sake. The much more interesting approach, is that being used by Sparkfun, who are manufacturing a series of "blocks" that let you mix and match various individual capabilities. 

Once you've prototyped everything, you would then manufacture a custom single board that used only what you needed for your embedded system. This is a very interesting way to approach modularity.

Thanks to the efforts of the Intel IoT team, there is a Linux image that includes everything you need for your code to access the various I/O capabilities of the various Intel boards. This is largely due to a compiled library called "MRAA", that is itself also open source.

We've just added support to Cylon.js for the Intel Edison, as well as updating our support for the Intel Galileo, so you can now use any of the GPIO and I2C devices that Cylon.js already includes, along with any of the many new devices that are being added all the time.

Short video showing it actually works...

We've provided instructions on how to get started with Cylon.js and the Intel Edison on our documentation page. Once you've installed the new cylon-intel-iot node module, you can test your code with the following simple example:

Code example here

We're really excited about the Intel Edison, and we will be adding more support for hardware based on this new platform as it comes out.

Keep up with our ongoing adventures on Twitter at [@cylonjs](http://twitter.com/cylonjs).
