'use strict';

var path = require('path');

exports.getArticlePath = getArticlePath;

function getArticlePath(relativeArticlePath) {
  var absoluteArticlePath = path.resolve('node_modules', 'arch-wiki-md-repo', 'wiki', relativeArticlePath);
  return absoluteArticlePath;
}
