var browserify = require('browserify')
  , vm = require('vm')
  , shim = require('..');

// Best possible API with current browserify transform implementation
var instance = browserify();

instance.transform(
    shim({ 
      jquery: { path: '../test/fixtures/shims/crippled-jquery', exports: '$' } 
    })
    // ugly
    .bind(instance)
  );

instance
  // uggh - needless repetition
  .require(require.resolve('../test/fixtures/shims/crippled-jquery'), { expose: 'jquery' })
  .require(require.resolve('../test/fixtures/entry-requires-jquery.js'), { expose: 'entry' })
  .bundle(function (err, src) {
    if (err) return console.error(err);

    var ctx = { window: {}, console: console };

    var require_ = vm.runInNewContext(src, ctx);

    console.log(require_('entry').getJqueryVersion());
  });

