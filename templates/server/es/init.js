'use strict';

var conf = require('../conf');
var _ = require('lodash');
var Promise = require('bluebird');
var glob = Promise.promisify(require('glob'));
var path = require('path');
var winston = require('../conf/winston');

var client = require('./client');

function getEsTypes() {
  return glob(path.join(__dirname, '../**/*.object.js'))
    .map(function mapFiles(filename) {
      return require(filename);
    })
  ;
}

function createIndicesIfNeeded() {
  return Promise.map(conf.elastic.indices, function (index) {
    return client.indices.exists({index: index})
      .then(function(exists) {
        if (exists)
          return;

        return client.indices.create({
          body: {
            settings: {
              index: {
                number_of_shards: conf.elastic.number_of_shards,
                number_of_replicas: conf.elastic.number_of_replicas,
              },
            },
          },
          index: index,
        })
        .tap(function() {
          winston.info('ELASTIC >>>> Index %s created', index);
        });
      })
    ;
  });
}

module.exports = function elasticInit() {
  winston.info('ELASTIC >>>> init elasticsearch');

  return Promise.join(
    getEsTypes(),
    createIndicesIfNeeded(),
    _.identity
  )
    .map(function(Type) {
      return Type.createOrUpdateMapping();
    })
    .return('')
    .tap(winston.info.bind(winston, 'ELASTIC >>>> Mapping created/updated!'))
  ;
};
