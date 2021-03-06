'use strict';

var Promise = require('bluebird');
var fsReadFile = Promise.promisify(require('fs').readFile);
var fsWriteFile = Promise.promisify(require('fs').writeFile);
var fsUnlink = Promise.promisify(require('fs').unlink);
var path = require('path');
var getArticlePath = require('./util').getArticlePath;
var sanitize = require('sanitize-filename');
var toTroff = require('markdown2troff');

var tmp = require('tmp');
var temp = null;

exports.convert = convert;
exports.getContents = getContents;
exports.tmpSave = tmpSave;
exports.removeTmp = removeTmp;
exports.getTmp = function getTmpLoc() { return temp; };

function convert(contents, options) {
  return toTroff(contents, options);
}

function getContents(article) {
  article.path = getArticlePath(article.mdPath);
  return fsReadFile(article.path, 'utf-8').then(function readArticle(contents) {
    article.contents = contents;
    article.title = sanitize(article.title);
    return article;
  }).catch(function failReadArticle(err) {
    console.log('Can\'t read ' + article.path + '. This should never happen. Try refreshing the database?');
    console.log('Error: ' + err);
  });
}

function tmpSave(roff) {
  temp = tmp.fileSync().name;
  return fsWriteFile(temp, roff, 'utf8').then(function writeRoff() {
    temp = path.resolve(temp);
    return temp;
  }).catch(function catchWrite(err2) {
    console.log('Could not write the temporary roff page');
    console.log('Error: ' + err2);
  });
}

function removeTmp() {
  return fsUnlink(temp).then(function deleteTmp() {
    return 'done';
  }).catch(function catchUnlink(err) {
    console.log('Could not delete the temporary file at ' + temp);
    console.log('Error: ', + err);
  });
}
