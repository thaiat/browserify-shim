'use strict';

var derequire = require('derequire')
  , debug     = require('./debug')

var dereqPre = '(function(require){\n'
  , dereqPreLen = dereqPre.length
  , dereqPost = '\n})()'
  , dereqPostLen = dereqPost.length

var go = module.exports = function (content) {
  // since shimming for this module was desired we must assume that all contained `require` statements are invalid
  // so remove them to prevent browerserify from trying to resolve these required modules
  var dereqed = derequire(dereqPre + content + dereqPost, '_dereq_', 'require');
  return dereqed.slice(dereqPreLen, -dereqPostLen);
}
