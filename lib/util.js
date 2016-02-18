'use strict';

var path = require('path');
var archWiki = require.resolve('arch-wiki-md-repo');

exports.getArticlePath = getArticlePath;
exports.findItem = findItem;

/**
 * Turn relative path from the database into an absolute path
 **/
function getArticlePath(relativeArticlePath) {
  var absoluteArticlePath = path.resolve(archWiki, '..', 'wiki', relativeArticlePath);
  return absoluteArticlePath;
}

/**
 * Replacement for _.find
 **/
function findItem(array, prop, match) {
  var i = 0;
  var len = array.length;

  for (; i < len; i++) {
    if (array[i][prop] === match) {
      return array[i];
    }
  }
}
