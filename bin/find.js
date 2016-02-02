#!/usr/bin/env node

'use strict';

var getContents = require('../lib/fileio').getContents;
var convert = require('../lib/fileio').convert;
var processMd = require('../lib/fileio').processMd;
var narrowDown = require('../lib/find').narrowDown;
var selectArticle = require('../lib/find').selectArticle;
var tmpSave = require('../lib/fileio').tmpSave;
var removeTmp  = require('../lib/fileio').removeTmp;

var lastUpdate = require('arch-wiki-md-repo').updated;
var articles = require('arch-wiki-md-repo').doneList;

var spawn = require('child_process').spawn;

var yargs = require('yargs')
  .usage('Usage: $0 <search terms>')
  .default('d', false)
  .boolean('d')
  .alias('d', 'deep-search')
  .help('h')
  .alias('h', 'help')
  .argv;

var searchTerms = yargs._;
var isDeep = yargs.d;

var options = {
  name: '',
  section: 1,
  description: '',
  date: lastUpdate,
  version: '1.0.0',
  manual: '',
};

Promise.resolve(narrowDown(articles, searchTerms, isDeep)).then(function select(filteredArticles) {
  return selectArticle(filteredArticles);
}).then(function makeRoff(selectedArticle) {
  return getContents(selectedArticle);
}).then(function passToRemarkMd(article) {
  return processMd(article);
}).then(function passToRemarkMan(article) {
  options.name = article.title;
  options.manual = article.url;
  options.description = article.description;

  return convert(article.contents, options);
}).then(function saveTmpFile(roff) {
  return tmpSave(roff);
}).then(function displayRoff(tmpFile) {
  var man = spawn('man', [tmpFile], { stdio: 'inherit' });
  man.on('exit', function onExit() {
    Promise.resolve(removeTmp()).then(function done() {
      console.log('All done');
    });
  });
}).catch(function catchAll(err) {
  console.log(err);
});
