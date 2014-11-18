---
page_title_show: true
title: "Creating pre-built binaries for Cylon modules"
page_title: Blog
date: 2014-11-18
tags: robots, node-pre-gyp, binaries, binary
author: Edgar Silva
active_menu_blog: true
---

Making Cylon and its modules easier to use and install is always a high priority item here at
The Hybrid Group.

  Unfortunately we often find issues  when people try to use some
of the coolest NPM modules for developing Javascript robotics like node-serialport, node-opencv
and gamepad among others, when they try to compile their native dependencies in one of the 3 major
platforms (Linux, Windows, OSX). We come across this issue quite often since several Cylon modules
also have dependencies for this NPM modules. And it is even more obvious when doing a workshop and
several of the attendants do not have all the dependencies required to compile these native extensions.

  That is why we took it upon ourselves to provide pre-built binaries for all the modules, that
have native dependencies and are used in Cylon or its submodules, for all major platforms. We
accomplish this using node-pre-gyp, which provides a very solid process to setup packaging and publishing of pre-compiled
binaries for easy consumption. Using node-pre-gyp in tandem with CI tools like AppVeyor (build for
Windows platforms) and TravisCI (build for Linux and OSX) we can automatically generate, package, publish and
have binary packages available each time a new version of the module is released.

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
  6. If CI build compilation fails, open a direct communication channel with them (forums, support), those guys can help a lot, they can even help you find the root cause if your local build fails.

  Let's check how to setup everything using the CI environment for all platforms(Linux, Windows and OSX). We'll be using
node-opencv module as an example since this was the one that presented the biggest challenge to setup.
For details on how to setup up [node-pre-gyp](https://github.com/mapbox/node-pre-gyp) bindings and package.json binary section check the [node-pre-gyp README](https://github.com/mapbox/node-pre-gyp),
it is very good, easy to understand and fill with details and options.

  ### How to setup Linux pre-compiled binaries in Travis CI

  Linux is probably the easiest platform to setup pre-compiled binaries for, in the case of opencv we have to make sure we
have all required dependencies installed and that is pretty much it, we'll go through the different sections of the .travis.yml
file and I will give an explanation of what we are doing, let's start from the beggining of the file, the build config section:

```yaml
# First we setup the the type of project, in this case node_js
language: node_js

# We also need to specify the node.js versions we want to build from,
# this is important because not all modules work with version 0.11 yet
# and we want to also create binaries for the different node versions.
node_js:
  - '0.10'
  - '0.11'

# What we'll be using to compile
compiler: clang

# Here we setup our secure env variables for AS3 publishing.
env:
  global:
  - secure: THE_VERY_LONG_SECURE_KEYS_FOR_PUBLISING
  - secure: THE_VERY_LONG_SECURE_KEYS_FOR_PUBLISING
```

  The above code should be pretty straight forward, we are just telling travis how our build should be configured, the type
of project, the versions of node.js, compiler and environment sensitive information.

  Next we have our `before_install` section where we install the dependencies we need and also check if this build should publish
binaries or not.

```yaml
before_install:
  # This fixes a problem with apt-get failing later, see http://docs.travis-ci.com/user/installing-dependencies/#Installing-Ubuntu-packages
  - sudo apt-get update -qq
  # We install all dependencies for node-opencv using apt-get
  - sudo apt-get install libcv-dev
  - sudo apt-get install libopencv-dev
  - sudo apt-get install libhighgui-dev
  # Get commit message to check if we should publish binary
  - COMMIT_MESSAGE=$(git show -s --format=%B $TRAVIS_COMMIT | tr -d '\n')
  # Put local npm modules .bin on PATH
  - export PATH=./node_modules/.bin/:$PATH
  # Install node-gyp and node-pre-gyp so it is available for packaging and publishing
  - npm install node-gyp -g
  - npm install node-pre-gyp
  # Install aws-sdk so it is available for publishing to AS3
  - npm install aws-sdk
  # Figure out if we should publish
  - PUBLISH_BINARY=false
  # If we are building a tag then we need to publish a new binary package
  - if [[ $TRAVIS_BRANCH == `git describe --tags --always HEAD` ]]; then PUBLISH_BINARY=true; fi;
  # or if we put the string [publish binary] in the commit message
  - if test "${COMMIT_MESSAGE#*'[publish binary]'}" != "$COMMIT_MESSAGE"; then PUBLISH_BINARY=true; fi;
```

  As you can see in the code above installing the dependencies in travis is pretty straight forward,
one thing to notice is that we use the commit message or tag to setup an env variable that we'll use
to check if we should publish a new binary package with this commit or not.

  Next up is our `install` section where we make sure the module compiles correctly and we run tests.

```yaml
install:
  # Ensure source install works and compiles correctly
  - npm install --build-from-source
  # test our module
  - npm test
  - node lib/opencv.js
```

  We are using the `before_script` section to package and publish the binary, a very easy process
if you already have the secure environment varibales setup in your .travis.yml file (as we can see above),
for details on how to set them up using the Travis gem check [here](http://docs.travis-ci.com/user/environment-variables/#Secure-Variables).

```yaml
before_script:
  - echo "Publishing native platform Binary Package? ->" $PUBLISH_BINARY
  # if we are publishing for this commit, do it
  - if [[ $PUBLISH_BINARY == true ]]; then node-pre-gyp package publish; fi;
  # cleanup
  - node-pre-gyp clean
  - node-gyp clean
```

  Two things worth mentioning here, One is we check for the environment variable `PUBLISH_BINARY` that we setup
earlier based on tag or commit message, that is what we use to know if we should publish at this time. Number Two
we cleanup the compiled binaries after publishing so we can test the remote binary can be installed correctly
later on.

  In the last section of the script we just make sure we can install from remote and print out the binaries
info:

```yaml
script:
  # if publishing, test installing from remote
  - INSTALL_RESULT=0
  - if [[ $PUBLISH_BINARY == true ]]; then INSTALL_RESULT=$(npm install --fallback-to-build=false > /dev/null)$? || true; fi;
  # if install returned non zero (errored) then we first unpublish and then call false so travis will bail at this line
  - if [[ $INSTALL_RESULT != 0 ]]; then echo "returned $INSTALL_RESULT";node-pre-gyp unpublish;false; fi
  # If success then we arrive here so lets clean up
  - node-pre-gyp clean

after_success:
  # if success then query and display all published binaries
  - node-pre-gyp info
```

  Again we use the `PUBLISH_BINARY` env varibale we setup in the `before_install` section, if we publish a new binary
we install from remote to make sure the binary works as expected.

  Finally we just print out all node-pre-gyp info about the binaries.

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
