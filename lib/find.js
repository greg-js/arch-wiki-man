'use strict';

exports.narrowDown = narrowDown;
exports.select = select;

function narrowDown(articles, terms) {
  var reSearchTerms = terms.map(function mapRE(term) {
    return new RegExp(term, 'i');
  });

  return articles.filter(function filterOnTitle(article) {
    return reSearchTerms.every(function checkRE(reTerm) {
      return reTerm.test(article.title);
    });
  });
}

function select() {

}
