#!/usr/bin/env node

'use strict';

var getContents = require('../lib/fileio').getContents;
var convert = require('../lib/fileio').convert;
var narrowDown = require('../lib/find').narrowDown;

var lastUpdate = require('arch-wiki-md-repo').updated;
var articles = require('arch-wiki-md-repo').doneList;
var selectedArticle = null;

var exec = require('child_process').exec;

var yargs = require('yargs')
  .usage('Usage: $0 <search terms>')
  .default('d', false)
  .boolean('d')
  .alias('d', 'deep-search')
  .help('h')
  .alias('h', 'help')
  .argv;

var searchTerms = yargs._;

// var options = {
//   name: '',
//   section: 1,
//   description: '',
//   date: lastUpdate,
//   version: '1.0.0',
//   manual: 'arch wiki manual',
// };

articles = narrowDown(articles, searchTerms);


// if (articles.length === 1) {
//   getContents(articles[0]).then(function passToRemark(data) {
//     console.log(convert(data.contents));
//   });

// } else {
//   console.log(articles);
// }

selectedArticle = { path: 'test/mock/mockArticle.md', title: 'foo bar', description: 'my description' };
// selectedArticle = articles[1747];

// TODO: remove the description from the main text
// TODO: reformat links and delete images

getContents(selectedArticle).then(function passToRemark(data) {
  // options.name = data.title;
  // options.manual = data.path;
  // options.description = data.description;

  console.log(convert(data.contents));
});
  // exec('man --warnings -E UTF-8 ' + convert(data.contents, options));
