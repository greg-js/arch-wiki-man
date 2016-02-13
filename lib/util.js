'use strict';

var path = require('path');
var archWiki = require.resolve('arch-wiki-md-repo');

exports.getArticlePath = getArticlePath;

function getArticlePath(relativeArticlePath) {
  console.log(relativeArticlePath);
  console.log(archWiki);

  var absoluteArticlePath = path.resolve(archWiki, '..', 'wiki', relativeArticlePath);
  return absoluteArticlePath;
}
