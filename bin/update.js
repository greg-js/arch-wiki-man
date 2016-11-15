#!/usr/bin/env node

'use strict';

var npmi = require('npmi');
var path = require('path');

var options = {
    name: 'arch-wiki-md-repo',
    path: path.resolve(__dirname + '/..'),
    forceInstall: true
};

npmi(options, function(err, result) {
    if (err) {
        if (err.code === npmi.LOAD_ERR) {
            console.log('npm load error');
        }
        else if (err.code === npmi.INSTALL_ERR) {
            console.log('npm install error');
        }
        return console.log(err.message);
    }

    console.log(options.name + ' has been successfully updated or reinstalled.');
});