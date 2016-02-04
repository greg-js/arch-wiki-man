'use strict';

var inquirer = require('inquirer');
var chalk = require('chalk');
var getContents = require('../lib/fileio').getContents;

exports.narrowDown = narrowDown;
exports.selectArticle = selectArticle;

function narrowDown(articles, terms, deep, apropos) {
  var reSearchTerms = terms.map(function mapRE(term) {
    // escape invalid regex characters in the search terms before making a new regex
    return new RegExp(term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'i');
  });

  var filtered = articles.filter(function filterOutCategoryPages(article) {
    return !article.category;
  });

  if (apropos) {
    filtered = filtered.map(function getArticleContents(art) {
      return getContents(art).then(function makeArts(article) {
        return article;
      });
    });
    return Promise.all(filtered).then(function filterIt(items) {
      return items.filter(function filterOnTitleContents(article) {
        return reSearchTerms.every(function checkRE(reTerm) {
          return reTerm.test(article.title) || reTerm.test(article.contents);
        });
      });
    });
  } else if (deep) {
    return filtered.filter(function filterOnTitleDesc(article) {
      return reSearchTerms.every(function checkRE(reTerm) {
        return reTerm.test(article.title) || reTerm.test(article.description);
      });
    });
  } else {
    return filtered.filter(function filterOnTitle(article) {
      return reSearchTerms.every(function checkRE(reTerm) {
        return reTerm.test(article.title);
      });
    });
  }
}

function selectArticle(articles) {
  return new Promise(function makePromise(resolve, reject) {
    var len = articles.length;
    var choices;
    var entry;

    var sorted = articles.sort(function sortSpecialLast(a, b) {
      return new Date(b.lastMod) - new Date(a.lastMod);
    });

    if (len === 0) {
      return reject('No articles match your query.');
    } else if (len === 1) {
      return resolve(sorted[0]);
    } else {
      choices = sorted.map(function makeChoices(article, index) {
        entry = ['[', chalk.yellow(index + 1), '/', chalk.yellow(len), '] ', chalk.green(article.title), ': ',  chalk.gray(article.description).slice(0, 150)].join('');
        return (article.description.length < 150) ? entry : entry + '...';
      });

      inquirer.prompt([{
        type: 'list',
        name: 'selection',
        message: 'Select the Arch Wiki article',
        choices: choices,
      }], function getAnswer(response) {
        var pos = choices.indexOf(response.selection);
        return resolve(sorted[pos]);
      });
    }
  });
}
