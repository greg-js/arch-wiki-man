'use strict';

var remark = require('remark');
var man = require('remark-man');
var Promise = require('bluebird');
var fsReadFile = Promise.promisify(require('fs').readFile);
var getArticlePath = require('../lib/util').getArticlePath;
var fsWriteFile = Promise.promisify(require('fs').writeFile);
var fsUnlink = Promise.promisify(require('fs').unlink);
var path = require('path');

var tmpFile = path.resolve('./tmp/tmpfile');

exports.convert = convert;
exports.getContents = getContents;
exports.tmpSave = tmpSave;
exports.removeTmp = removeTmp;

function convert(contents, options) {
  return remark.use(man, options).process(contents);
}

function getContents(article) {
  return fsReadFile(article.path, 'utf-8').then(function readArticle(contents) {
    return {
      path: getArticlePath(article.path),
      title: article.title,
      description: article.description,
      contents: contents,
    };
  }).catch(function failReadArticle(err) {
    console.log('Can\'t read ' + article.path + '. This should never happen. Try refreshing the database?');
    console.log('Error: ' + err);
  });
}

function tmpSave(roff) {
  return fsWriteFile(tmpFile, roff, 'utf8').then(function writeRoff() {
    return path.resolve(tmpFile);
  }).catch(function catchWrite(err) {
    console.log('Could not write the temporary roff page');
    console.log('Error: ' + err);
  });
}

function removeTmp() {
  return fsUnlink(tmpFile).then(function deleteTmp() {
    return 'done';
  }).catch(function catchUnlink(err) {
    console.log('Could not delete the temporary file at ' + tmpFile);
    console.log('Error: ', + err);
  });
}
