'use strict';

var util = require('gulp-util'),
	through = require('through2'),
	path    = require('path'),
	fs      = require('fs'),
  _       = require('underscore');

module.exports = function (options) {
  var cache = {},
      globalData = {};
	options = _.extend({
		property: 'data',
		getRelativePath: function(file) {
			return util.replaceExtension(path.basename(file.path), '.json');
		},
	}, options || {});

  var parseGlobalData = function(dataDir) {
    var dataFiles = fs.readdirSync(dataDir);
    dataFiles.forEach(function(dataFilename) {
      var name = dataFilename.substr(0, dataFilename.lastIndexOf('.'));
      if (path.extname(dataFilename) === '.json') {
        globalData[name] = JSON.parse(fs.readFileSync(dataDir + '/' + dataFilename));
      }
    });
  };

  if (options.dataDir) {
    parseGlobalData(options.dataDir);
  }

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
    file[options.property] = _.extend(globalData, file[options.property] || {}, jsonData);

		this.push(file);
		cb();
	});
};
