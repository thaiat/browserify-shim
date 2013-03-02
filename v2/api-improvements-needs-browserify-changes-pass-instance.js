var browserify = require('browserify')
  , vm = require('vm')
  , shim = require('..');

// Best possible API with slightly changed browserify 

var instance = browserify();
instance
  .transform(
    shim(instance, { 
      jquery: { path: '../test/fixtures/shims/crippled-jquery', exports: '$' } 
    })
  )
  .require(require.resolve('../test/fixtures/entry-requires-jquery.js'), { expose: 'entry' })
  .bundle(function (err, src) {
    if (err) return console.error(err);

    var ctx = { window: {}, console: console };

    var require_ = vm.runInNewContext(src, ctx);

    console.log(require_('entry').getJqueryVersion());
  });


/* Changes necessary to make this work - last two lines
 *  Browserify.prototype.transform = function (t) {
 *    if (typeof t === 'string' && /^\./.test(t)) {
 *        t = path.resolve(t);
 *    }
 *    this._transforms.push(t.bind(this));
 *    return this;
 *};
 */
