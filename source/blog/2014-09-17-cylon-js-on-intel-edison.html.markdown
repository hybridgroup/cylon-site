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

The stacking connector is one big clue to how Intel plans on the Edison being used: it is the base for a highly customized modular solution, that puts the Edison's GPIO, I2C, UARTs and other capabilities to work in a unique way. The Arduino-compatible breakout board for the Edison, is just for compatibility sake. The much more interesting approach, is that being used by Sparkfun, who are manufacturing a series of "blocks" that let you mix and match various individual capabilities. Once you've prototyped your embedded system, you could then manufacture a custom single board that used only what you needed. Very cool!

Something about cylon-intel-iot

perhaps a tiny video showing it actually works?

Code example here

Keep up with our ongoing adventures on Twitter at [@cylonjs](http://twitter.com/cylonjs).
