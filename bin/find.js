#!/usr/bin/env node

'use strict';

var findItem = require('../lib/util').findItem;
var getContents = require('../lib/fileio').getContents;
var convert = require('../lib/fileio').convert;
var narrowDown = require('../lib/find').narrowDown;
var selectArticle = require('../lib/find').selectArticle;
var tmpSave = require('../lib/fileio').tmpSave;
var removeTmp  = require('../lib/fileio').removeTmp;
var chalk = require('chalk');

var lastUpdate = require('arch-wiki-md-repo').updated;
var db = require('arch-wiki-md-repo').db;

var spawn = require('child_process').spawn;

var yargs = require('yargs')
  .usage('Usage: $0 <search terms>')
  .default('d', false)
  .boolean('d')
  .alias('d', 'desc-search')
  .describe('d', 'search in descriptions')
  .default('k', false)
  .boolean('k')
  .alias('k', 'apropos')
  .describe('k', 'search in article contents')
  .default('w', false)
  .boolean('w')
  .alias('w', 'web')
  .describe('w', 'open in browser')
  .default('l', 'english')
  .alias('l', 'language')
  .describe('l', 'choose a language (note: auto-fallback to English if no matches are found)')
  .boolean('list-languages')
  .describe('list-languages', 'print a list of available languages')
  .help('h')
  .alias('h', 'help')
  .argv;

var searchTerms = yargs._;
var isDeep = yargs.d;
var isApro = yargs.k;
var isWeb = yargs.w;
var lang = yargs.l;

var articles;
var englishArticles = null;
var doFallback = false;
var langs;

var options = {
  name: '',
  section: 1,
  description: '',
  date: lastUpdate,
  version: '1.1.0',
  manual: '',
};

yargs.$0 = 'awman';

if (yargs.listLanguages) {
  langs = db.map(function getLanguages(e) { return e.lang; }).sort();
  langs.forEach(function printLanguages(lan) { console.log(lan); });
  process.exit();
}

try {
  articles = findItem(db, 'lang', lang).articles;
} catch (e) {
  if (e instanceof TypeError) {
    console.log('Sorry, ' + chalk.yellow(lang) + ' is ' + chalk.bold('not') + ' a supported language.\n`awman --list-languages` to get a list of available languages');
    process.exit();
  }
}

if (lang !== 'english') {
  englishArticles = findItem(db, 'lang', 'english').articles;
}

Promise.resolve(narrowDown(articles, searchTerms, isDeep, isApro, doFallback, englishArticles)).then(function select(filteredArticles) {

  return selectArticle(filteredArticles, lang, searchTerms, isDeep, isApro, englishArticles);

}).then(function makeRoff(selectedArticle) {

  return getContents(selectedArticle);

}).then(function processArticle(article) {

  if (isWeb) {
    spawn('xdg-open', [article.url]);
    process.exit();
  }

  return article;

}).then(function passToRemarkMan(article) {

  options.name = article.title;
  options.manual = article.url;

  return convert(article.contents, options);

}).then(function saveTmpFile(roff) {

  return tmpSave(roff);

}).then(function displayRoff(tmpFile) {

  var man = spawn('man', [tmpFile], { stdio: 'inherit' });

  man.on('exit', function onExit() {
    Promise.resolve(removeTmp()).then(function done() {
    });
  });

}).catch(function catchAll(err) {

  console.error(chalk.red(err));

  if (err.stack) {
    console.log(chalk.yellow(err.stack));
  }

});
