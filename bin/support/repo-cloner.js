// jshint node:true
"use strict";

var cluster = require("cluster"),
    path = require("path"),
    numberOfCores = require("os").cpus().length;

var exec = require("shelljs").exec,
    fs = require("fs-extra"),
    _ = require("lodash");

var dir = path.resolve(__dirname, "./../../.import");

if (cluster.isMaster) {
  cluster.setupMaster({
    exec: __dirname + "/repo-cloner.js"
  });

  module.exports = function(callback) {
    var repos = require("./repos").slice();

    console.log("Cloning/updating repos.");

    var updateWorker = function(worker) {
      if (repos.length) {
        worker.send({ repo: repos.shift() });
        return;
      }

      worker.kill();
    };

    cluster.on("exit", function() {
      // fully shutdown, trigger callback if we're done
      if (!_.keys(cluster.workers).length) {
        cluster.disconnect(callback);
      }
    });

    _.times(numberOfCores, cluster.fork);

    cluster.on("online", updateWorker);

    _.forIn(cluster.workers, function(worker, id) {
      worker.on("message", function(msg) {
        if (msg === "done") {
          updateWorker(worker);
          return;
        }
      });
    });
  }
} else {
  var wid = cluster.worker.id;

  process.on("message", function(msg) {
    if (msg.repo) {
      var repo = msg.repo,
          cmd,
          result;

      var uri = "git://github.com/hybridgroup/" + repo + ".git",
          dest = dir + "/" + repo;

      if (!fs.existsSync(dest)) {
        cmd = "git clone " + uri + " " + dest;

        result = exec(cmd, { silent: true });

        if (result.code !== 0) {
          console.log("\nError during 'git clone': " + result.output);
          process.exit(1);
        }
      } else {
        process.chdir(dest);

        cmd = "git fetch && git reset --hard origin/master";

        result = exec(cmd, { silent: true });

        if (result.code !== 0) {
          console.log("\nError during 'git fetch': " + result.output);
          process.exit(1);
        }
      }

      process.send("done");
    }
  });
  }
