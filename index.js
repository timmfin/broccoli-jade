'use strict';
var Filter = require('broccoli-filter');
var jade = require('jade');
var path = require('path');
var objectAssign = require('object-assign');


function JadeFilter(inputTree, options) {
	if (!(this instanceof JadeFilter)) {
		return new JadeFilter(inputTree, options);
	}

	this.inputTree = inputTree;
	this.options = options || {};
}

JadeFilter.prototype = Object.create(Filter.prototype);
JadeFilter.prototype.constructor = JadeFilter;

JadeFilter.prototype.extensions = ['jade'];
JadeFilter.prototype.targetExtension = 'html';

JadeFilter.prototype.processString = function (str, relativePath, srcDir) {

	// If using loadPaths, add the current temp dir
	var adjustedloadPaths = this.options.loadPaths;

	if (this.options.includeSrcDirInLoadPaths && this.options.loadPaths !== undefined && this.options.loadPaths !== null) {
		adjustedloadPaths.unshift(srcDir);
	}

	// Pass along the filename option so that include/extend can work
	var tempOptions = objectAssign(this.options, {
		filename: path.join(srcDir, relativePath),
		// basedir: this.options.basedir ? this.options.basedir : srcDir
		loadPaths: adjustedloadPaths
	});

	var func = jade.compile(str, tempOptions);
	return func(this.options.data);
};

module.exports = JadeFilter;
