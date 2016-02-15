/* eslint-env mocha */
/* eslint func-names:0 no-unused-expressions:0 */

'use strict';

var expect = require('chai').expect;
var find = require('../lib/find');
// var fsReadFile = Promise.promisify(require('fs').readFile);
// var fsUnlink = Promise.promisify(require('fs').unlink);
// var fsWriteFile = Promise.promisify(require('fs').writeFile);
// var path = require('path');

describe('methods', function() {
  it('has a narrowDown function', function() {
    expect(find.narrowDown).to.be.a('function');
  });

  it('has a selectArticle function', function() {
    expect(find.selectArticle).to.be.a('function');
  });
});

describe('narrowDown', function() {
  var articles = [{title: 'foo1'}, {title: 'bar foo 2'}, {title: 'bar'}];

  it('returns empty array if no terms match', function() {
    expect(find.narrowDown(articles, ['baz', 'bam']).length).to.equal(0);
    expect(find.narrowDown(articles, ['foo bar']).length).to.equal(0);
  });

  it('returns the matching articles', function() {
    expect(find.narrowDown(articles, ['bar foo']).length).to.equal(1);
    expect(find.narrowDown(articles, ['foo', 'bar']).length).to.equal(1);
    expect(find.narrowDown(articles, ['foo']).length).to.equal(2);
    expect(find.narrowDown(articles, ['bar']).length).to.equal(2);
  });
});

describe('selectArticle', function() {
  it('throws an error if the passed in articles array is empty', function(done) {
    find.selectArticle([], 'english').then(function() {
      // this should never run
      console.warning('check ./test/find.js because you should never see this');
      done();
    }).catch(function(err) {
      expect(err).to.be.a('string');
      expect(err).to.equal('No articles match your query.');
      done();
    });
  });

  it('returns the article when the passed in articles array only contains one item', function(done) {
    find.selectArticle([{title: 'foo'}]).then(function(data) {
      expect(data).to.be.an('object');
      done();
    });
  });
});

