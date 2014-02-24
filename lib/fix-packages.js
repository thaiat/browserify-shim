'use strict';

var readdirp = require('readdirp')
  , fs       = require('fs')
  , through  = require('through2')
  ;

var fixed = {};

module.exports = 

/**
 * Removes all package.json files inside the given root recursively, ignoring node_modules, .git and .svn.
 * 
 * @name fixPackages
 * @function
 * @param {string} root full path to root at which to start removing, is assumed to exist
 * @param {Array.<string} messages to which diagnostics are pushed
 * @param {function } cb called back with error if it failed or nothing if successful
 * @return 
 */
function fixPackages(root, messages, cb) {
  if (fixed[root]) {
    messages.push('packages were fixed before, skipping');
    return cb();
  }
  readdirp(
      { root: root 
      , fileFilter: 'package.json'
      , directoryFilter: [ '!node_modules', '!.git', '!.svn' ]
      }
  )
  .on('error', cb)
  .on('end', cb)
  .pipe(through({objectMode: true }, function (entry, _, cb) {
    messages.push('removing ' + entry.path);
    fs.unlink(entry.fullPath, cb);
  }))
  .on('error', cb)
}
