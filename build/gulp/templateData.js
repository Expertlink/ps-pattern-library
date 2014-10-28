'use strict';

var util = require('gulp-util'),
	through = require('through2'),
	path    = require('path'),
	fs      = require('fs'),
  _       = require('underscore');

module.exports = function (options) {
  var cache = {};
	options = _.extend({
		property: 'data',
		getRelativePath: function(file) {
			return util.replaceExtension(path.basename(file.path), '.json');
		}
	}, options || {});

	return through.obj(function (file, enc, cb) {
    var jsonData = {},
        relPath, absPath;

		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new util.PluginError('Template Data', 'Streaming not supported'));
			return cb();
		}

		relPath        = options.getRelativePath(file);
		absPath        = path.resolve(path.dirname(file.path), relPath);

    if (typeof cache[absPath] !== 'undefined') {
      jsonData = cache[absPath];
    } else if (fs.statSync(absPath).isFile()){
  		try {
        jsonData       = JSON.parse(fs.readFileSync(absPath));
        cache[absPath] = jsonData;
  		} catch (err) {
  			// this.emit('error', new util.PluginError(PLUGIN_NAME, err));
  		}
    }
    file[options.property] = _.extend(file[options.property] || {}, jsonData);

		this.push(file);
		cb();
	});
};
