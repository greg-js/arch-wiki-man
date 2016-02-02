/* eslint-env mocha */
/* eslint func-names:0 no-unused-expressions:0 */

'use strict';

var expect = require('chai').expect;
var fileio = require('../lib/fileio');
var Promise = require('bluebird');
var fsReadFile = Promise.promisify(require('fs').readFile);
var fsUnlink = Promise.promisify(require('fs').unlink);
var fsWriteFile = Promise.promisify(require('fs').writeFile);
var path = require('path');

describe('methods', function() {
  it('has a convert function', function() {
    expect(fileio.convert).to.be.a('function');
  });

  it('has a getContents function', function() {
    expect(fileio.getContents).to.be.a('function');
  });

  it('has a tmpSave function', function() {
    expect(fileio.tmpSave).to.be.a('function');
  });

  it('has a removeTmp function', function() {
    expect(fileio.removeTmp).to.be.a('function');
  });

  it('has a processMd function', function() {
    expect(fileio.processMd).to.be.a('function');
  });
});

describe('getContents', function() {
  var mockArticle = {
    title: 'foo bar',
    path: path.join(process.cwd(), 'test', 'mock', 'mockArticle.md'),
    description: 'my description',
  };
  var finishedMockArticle = Object.create(mockArticle);

  before(function(done) {
    fsReadFile(mockArticle.path, 'utf8').then(function(data) {
      finishedMockArticle.contents = data;
      done();
    }).catch(function(err) { console.log(err);});
  });

  it('takes in an article object and adds contents to it', function(done) {
    fileio.getContents(mockArticle).then(function(newArticle) {
      expect(newArticle.title).to.equal(finishedMockArticle.title);
      expect(newArticle.path).to.equal(finishedMockArticle.path);
      expect(newArticle.description).to.equal(finishedMockArticle.description);
      expect(newArticle.contents).to.equal(finishedMockArticle.contents);
      done();
    });
  });
});

describe('convert', function() {
  var testPath = path.join(process.cwd(), 'test', 'mock', 'mockArticle.md');
  var contents = null;
  var goodRoff = null;

  before(function(done) {
    fsReadFile(testPath, 'utf8').then(function(data) {
      contents = data;
    }).then(function() {
      return fsReadFile(path.join(process.cwd(), 'test', 'mock', 'mockArticle.roff'), 'utf8');
    }).then(function(result) {
      goodRoff = result;
      done();
    }).catch(function(err) { console.log(err); });
  });

  it('converts articles from md to roff', function() {
    expect(fileio.convert(contents)).to.contain(goodRoff.substr(1, -1).trim());
  });
});

describe('tmpSave', function() {
  var tmp = null;

  it('saves a temporary file', function(done) {
    fileio.tmpSave('hello world').then(function(tmpFile) {
      tmp = tmpFile;
      expect(tmpFile).to.equal(path.resolve('./tmp/tmpfile'));
      fsReadFile(tmpFile, 'utf8').then(function(contents) {
        expect(contents).to.equal('hello world');
        done();
      });
    });
  });

  after(function(done) {
    fsUnlink(tmp).then(function() {
      done();
    });
  });
});

describe('removeTmp', function() {
  var tmp = path.resolve('./tmp/tmpfile');

  before(function(done) {
    fsWriteFile(tmp, 'hello world').then(function() {
      done();
    });
  });

  it('deletes the temporary file', function(done) {
    fileio.removeTmp().then(function(result) {
      expect(result).to.equal('done');
      done();
    });
  });
});

describe('processMd', function() {
  var article = {
    contents: '[foo](http://www.bar.com)',
  };

  it('processes the markdown', function() {
    var converted = fileio.processMd(article);
    expect(converted).to.be.an('object');
    expect(converted.contents).to.equal('foo\n');
  });
});
