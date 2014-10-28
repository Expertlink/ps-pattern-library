'use strict';

var util = require('gulp-util'),
	through = require('through2'),
	path    = require('path'),
	fs      = require('fs'),
  _       = require('underscore');

module.exports = function (options) {
	options = _.extend({
		property: 'data',
		getRelativePath: function(file) {
			return util.replaceExtension(path.basename(file.path), '.json');
		}
	}, options || {});

	return through.obj(function (file, enc, cb) {
		var relPath, absPath, existingData;

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
      existingData = file[options.property] || {};
			file[options.property] = _.extend(existingData, JSON.parse(fs.readFileSync(absPath)));
		} catch (err) {
			// this.emit('error', new util.PluginError(PLUGIN_NAME, err));
		}

		this.push(file);
		cb();
	});
};
