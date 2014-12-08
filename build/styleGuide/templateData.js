'use strict';

var util       = require('gulp-util'),
	through      = require('through2'),
	path         = require('path'),
	fs           = require('fs'),
  _            = require('underscore'),
	templateUtil = require('./templateUtil');

module.exports = function (options) {
  var cache = {},
      contextData = {};
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
        contextData[name] = JSON.parse(fs.readFileSync(dataDir + '/' + dataFilename));
      }
    });
  };

	var parseLocalData = function(localDataDir) {
		var filenames = fs.readdirSync(localDataDir);
		filenames.forEach(function(filename) {
			var candidate = localDataDir + '/' + filename,
			stats   = fs.statSync(candidate),
			key, parentKey, fileKey;
			if (stats && stats.isDirectory()) {
				parseLocalData(localDataDir + '/' + filename);
			} else if (path.extname(filename) === '.json') {
				key = templateUtil.templateKey(localDataDir + '/' + filename).split('/');
				fileKey = key.pop();
				parentKey = key.pop();


			}
		});
	};

  if (options.dataDir) {
    parseGlobalData(options.dataDir);
  }

	if (options.localDataDir) {
		parseLocalData(options.localDataDir);
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
      jsonData     = cache[absPath];
    } else if (fs.existsSync(absPath) &&
               fs.statSync(absPath).isFile() ){
  		try {
        jsonData       = JSON.parse(fs.readFileSync(absPath));
        cache[absPath] = jsonData;
  		} catch (err) {
  			// this.emit('error', new util.PluginError(PLUGIN_NAME, err));
  		}
    }
    file[options.property] = _.extend(contextData, file[options.property] || {}, jsonData);

		this.push(file);
		cb();
	});
};
