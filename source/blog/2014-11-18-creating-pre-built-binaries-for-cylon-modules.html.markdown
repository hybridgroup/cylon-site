---
page_title_show: true
title: "Creating pre-built binaries for Cylon modules"
page_title: Blog
date: 2014-11-18
tags: robots, node-pre-gyp, binaries, binary
author: Edgar Silva
active_menu_blog: true
---
:markdown
  Making Cylon and its modules easier to use and install is always a high priority item here at
The Hybrid Group.

  Unfortunately we often find out blockers when people try to use some
of the coolest NPM modules for developing Javascript robotics like node-serialport, node-opencv,
gamepad among others, and they try to compile their native dependencies in one of the 3 major
platforms (Linux, Windows, OSX). We've seen this issue quite often since several Cylon modules
also have dependencies for them. And it is even more obvious when doing a workshop where some
of the attendants might not have all the dependencies required to compile their native extensions.

  That is why we took it upon ourselves to provide pre-built binaries for all the modules, that
have native dependencies and are used in Cylon or its submodules, for all major platforms (both
64 and 32 bit), all of this thanks to node-pre-gyp which makes it easy to setup packaging and
publishing for consumption. Using node-pre-gyp in tandem with CI tools like app-veyor(built for
Windows platforms) and travis(built for Linux and OSX) lets us automatically generate the binary
packages each time a new version of the module is released.

  ## Steps to setup and auto generate the binary packages

  This are the steps we follow to be able to auto generate binary packages that can be used by anyone.

  1. Add node-pre-gyp hooks and dependencies to your module.
  2. Make sure you can compile and package your binary dependencies.
  3. Setup a publishing mechanism (node-pre-gyp recommends AS3).
  4. Make sure you can publish the binary package.
  5. Setup CI tools to automatically autogenerate the binary packages on new releases.
  6. Add a Make task to make release and publish easier.

  ## Making sure compilation works in all platforms

  This is probably the most crucial part, since you need to test compilation and packaging in all 3
platforms, and relying in the CI tools to accomplish this can make it painfully slow to test and make it work,
since nobody should have to wait 30 mins just see your build fail in Travis or AppVeyor.

  So in short is always better to do this in a local machine first and take notes, then push to the
CI tools to build, compile, test, package and publish.

  Some recommendations to make this process smoother:

  1. Make it work locally on each platform first (VM or HW).
  2. Take notes on all dependecies you install, updates to Path and environment varibles you setup.
  3. Check bindings.gyp for dependency details and Path hints.
  4. Keep booth appveyor.yml and travis.yml up to date with your local process.
  5. Only publish from CI tools after you confirm the module compiles correctly, otherwise you'll have to continously delete the publish binaries for the same version.
  6. If CI build compilation fails, open a direct communication channel with them, this guys can help a lot, even help you find the root cause if your local build fails.

  ## What modules have we add pre-built binaries to?

  So far we've added (or are working on) pre-built binaries for the following:

  ### Currently using pre-built binaries:

  - node-serialport
  - gamepad

  ### Pending PRs to be merged:

  - node-opencv

  ### Implementation in progress or waiting in the queue:

  - noble
  - node-lame
  - node-speaker

  For more updates, be sure to follow us on Twitter at [@CylonJS][].

  [@CylonJS]: https://twitter.com/CylonJS
