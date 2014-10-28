'use strict';

var util = require('gulp-util'),
	through = require('through2'),
	path    = require('path'),
	fs      = require('fs');

var isObject = function(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};

var extend = function(obj) {
    if (!isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };


module.exports = function (options) {
	options = extend({
		property: 'data',
		getRelativePath: function(file) {
			return util.replaceExtension(path.basename(file.path), '.json');
		}
	}, options || {});

	return through.obj(function (file, enc, cb) {
		var relPath, absPath;

		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new util.PluginError('Template Data', 'Streaming not supported'));
			return cb();
		}

		relPath = options.getRelativePath(file);
		absPath = path.resolve(path.dirname(file.path), relPath);

		try {
			file[options.property] = JSON.parse(fs.readFileSync(absPath));
		} catch (err) {
			// this.emit('error', new util.PluginError(PLUGIN_NAME, err));
		}

		this.push(file);
		cb();
	});
};
