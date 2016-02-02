'use strict';

var inquirer = require('inquirer');
var chalk = require('chalk');

exports.narrowDown = narrowDown;
exports.selectArticle = selectArticle;

function narrowDown(articles, terms, deep) {
  var reSearchTerms = terms.map(function mapRE(term) {
    return new RegExp(term, 'i');
  });

  var filtered = articles.filter(function filterOutCategoryPages(article) {
    return !article.category;
  });

  if (deep) {
    return filtered.filter(function filterOnTitle(article) {
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
      return (/\-/.test(a.title.split(' ')[0]) && !/\-/.test(b.title.split(' ')[0])) || (/DeveloperWiki/.test(a.title.split(' ')[0]) && /DeveloperWiki/.test(b.title.split(' ')[0])) || a.title.length > b.title.length ? 1 : -1;
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
        pageSize: 15,
      }], function getAnswer(response) {
        var pos = choices.indexOf(response.selection);
        return resolve(sorted[pos]);
      });
    }
  });
}
