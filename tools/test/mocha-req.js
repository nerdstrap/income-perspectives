'use strict';

process.env.NODE_ENV = 'test';
var appRoot = __dirname + '/../../';
require(appRoot + 'server.js');
require('ns-meanio/lib/core_modules/module/util').preload(appRoot + '/packages/**/server', 'model');
