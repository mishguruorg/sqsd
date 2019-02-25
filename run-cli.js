#!/usr/bin/env node
'use strict';

var forever = require('forever-monitor');
var logger = require('./lib/logger');
var path = require('path');

var pkg = require('./package.json');

var restartCount = 0;
var sqsdProcess = new (forever.Monitor)(path.join(__dirname, 'cli.js'), {
    max: 1000,
    minUptime: 22000,
    args: process.argv.slice(2)
});

sqsdProcess.on('error', function (err) {
    console.error( {err:err}, 'Error caused SQSD to crash.');



});

sqsdProcess.on('restart', function () {
    console.warn({restartCount:restartCount}, 'It is likely that an error caused SQSD to crash.');
    ++restartCount;

});

sqsdProcess.on('exit', function () {
    console.info('SQSD stopped, terminating daemon');
    process.exit(0)
});

sqsdProcess.start();
