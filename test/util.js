/* eslint-env mocha */
/* eslint func-names:0 no-unused-expressions:0 */

'use strict';

var expect = require('chai').expect;
var util = require('../lib/util');
var path = require('path');

describe('methods', function() {
  it('has a getArticlePath function', function() {
    expect(util.getArticlePath).to.be.a('function');
  });
});

describe('relativeArticlePath', function() {
  var mockDb = [{title: 'foo', path: path.join('_content', 'foo.md')}, {title: 'bar', path: path.join('_content', 'bar.md')}];
  var convertedFoo = util.getArticlePath(mockDb[0].path);
  var convertedBar = util.getArticlePath(mockDb[1].path);
  var reFooToMatch = new RegExp(path.join('node_modules', 'arch-wiki-md-repo', 'wiki', '_content', 'foo.md'), 'i');
  var reBarToMatch = new RegExp(path.join('node_modules', 'arch-wiki-md-repo', 'wiki', '_content', 'bar.md'), 'i');

  it('converts relative paths from the db to absolute', function() {
    expect(convertedFoo).to.match(reFooToMatch);
    expect(convertedBar).to.match(reBarToMatch);
  });
});
