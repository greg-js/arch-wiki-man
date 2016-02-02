#!/usr/bin/env node

'use strict';

var getContents = require('../lib/fileio').getContents;
var convert = require('../lib/fileio').convert;
var narrowDown = require('../lib/find').narrowDown;
var selectArticle = require('../lib/find').selectArticle;
var getArticlePath = require('../lib/util').getArticlePath;
var tmpSave = require('../lib/fileio').tmpSave;
var removeTmp  = require('../lib/fileio').removeTmp;

var lastUpdate = require('arch-wiki-md-repo').updated;
var articles = require('arch-wiki-md-repo').doneList;

// var kexec = require('kexec');
// var spawn = require('child_process').spawnSync;
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
  // selectedArticle = articles[1747];
  selectedArticle.path = getArticlePath(selectedArticle.path);
  return getContents(selectedArticle);
}).then(function passToRemark(data) {
  options.name = data.title;
  options.manual = data.url;
  options.description = data.description;

  return Promise.resolve(convert(data.contents, options));
}).then(function saveTmpFile(roff) {
  return tmpSave(roff);
}).then(function displayRoff(tmpFile) {
  var man = spawn('man', [tmpFile], { stdio: 'inherit' });
  man.on('exit', function onExit() {
    Promise.resolve(removeTmp()).then(function done() {
      console.log('All done');
    });
  });
});
  // TODO: remove the description from the main text
  // TODO: reformat links and delete images

