// clones/updates repos

"use strict";

var Promise = require("bluebird");

var path = require("path"),
    exec = Promise.promisify(require("child_process").exec),
    fs = Promise.promisifyAll(require("fs"));

var request = require("superagent");

var DEST = require("path").resolve(__dirname, "./../../.import");

// finds all cylon-* repos, and update docs/examples
module.exports = function update() {
  return ensureDir().then(list).map(cloneOrUpdate);
}

function ensureDir() {
  return fs.mkdirAsync(DEST).catch(function(err) {
    if (err.code !== "EEXIST") { throw err; }
  });
}

function get(url) {
  return new Promise(function(resolve, reject) {
    request.get(url).end(function(err, res) {
      if (err) { reject(err); }
      resolve(res.body);
    });
  });
}

function list() {
  function flatten(total, data) { return total.concat(data); }
  function getName(repo) { return repo.name; }
  function filter(name) {
    return /^cylon-.*$/.test(name) || /^cylon$/.test(name);
  }

  // reject stuff we don't want to import
  function reject(name) {
    var bad = [
      /cylon-DF14/,
      /cylon-alljoyn/,
      /cylon-demo/,
      /cylon-example/,
      /cylon-galileo/,
      /cylon-glass/,
      /cylon-integration-tests/,
      /cylon-preso/,
      /cylon-site/,
      /cylon-tessel-example/,
      /cylon-workshop/,
      /cylon-cli/,
    ];

    return !bad.some(function(regex) { return regex.test(name); });
  }

  return Promise.all([
    get("https://api.github.com/users/hybridgroup/repos?per_page=100"),
    get("https://api.github.com/users/hybridgroup/repos?per_page=100&page=2"),
  ])
    .reduce(flatten)
    .map(getName)
    .filter(filter)
    .filter(reject);
}

function existing(dir) {
  return new Promise(function(resolve) {
    fs.stat(dir, function(err) {
      resolve(!err);
    });
  });
}

function cloneOrUpdate(project) {
  var dir = path.join(DEST, project),
      uri = "git://github.com/hybridgroup/" + project + ".git";

  function error(err) {
    console.error("Error updating", project, ":", err);
  }

  function name() { return project; }

  function handle(exists) {
    var cmd = "git clone " + uri + " " + dir,
        cwd = DEST.replace("./");

    if (exists) {
      cmd = "git pull origin master";
      cwd = dir;
    }

    return exec(cmd, { cwd: cwd }).then(name).catch(error);
  }

  return existing(dir).then(handle);
}
