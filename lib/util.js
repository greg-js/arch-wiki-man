'use strict';

var path = require('path');
var archWiki = require.resolve('arch-wiki-md-repo');

exports.getArticlePath = getArticlePath;

function getArticlePath(relativeArticlePath) {
  var absoluteArticlePath = path.resolve(archWiki, '..', 'wiki', relativeArticlePath);
  return absoluteArticlePath;
}
