'use strict';

var elasticsearch = require('elasticsearch');
var config = require('../config');

module.exports = new elasticsearch.Client({host: config.elastic.host});
