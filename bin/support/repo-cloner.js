"use strict";

var path = require("path");

var exec = require("shelljs").exec,
    fs = require("fs-extra"),
    _ = require("lodash");

var repos = require("./repos.json");

var stdout = process.stdout;

var dir = path.resolve(__dirname, "./../../.import");

function pad(str, length) {
  return str.length < length ? pad(str + " ", length) : str;
}

console.log("Cloning repos.");

var padding = _.max(
  repos, function(s) { return s.length; }
).length;

module.exports = function clone() {
  _.each(repos, function(slug) {
    var uri = "git://github.com/hybridgroup/" + slug + ".git",
        dest = dir + "/" + slug;

    if (fs.existsSync(dest)) {
      fs.removeSync(dest);
    }

    var cmd = "git clone " + uri + " " + dest;

    stdout.write("\rCloning " + slug + "...");

    var result = exec(cmd, { silent: true });

    if (result.code !== 0) {
      console.log("\nError during 'git clone': " + result.output);
      process.exit(1);
    }

    stdout.write("\r" + pad("", padding + 10) + "\r");
  });

  return true;
}
