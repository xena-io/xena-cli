'use strict';

import conf from '../conf/environment';
import _ from 'lodash';
import Promise from 'bluebird';
import Glob from 'glob';
import path from 'path';
import winston from 'winston';

import client from './client';

const glob = Promise.promisify(Glob);

function getEsTypes () {
  return glob(path.join(__dirname, '../**/*.object.js'))
    .map((filename) => {
      return require(filename).default;
    })
  ;
}

function createIndexIfNeeded() {
  return client.indices.exists({index: conf.elastic.index})
    .then((exists) => {
      if (exists)
        return;
      return client.indices.create({
        body: {
          settings: {
            index: {
              number_of_shards: conf.elastic.number_of_shards,
              number_of_replicas: conf.elastic.number_of_replicas
            }
          }
        },
        index: conf.elastic.index,
      })
        .then((res) => {
          winston.info('[ELASTIC] >>>> Index created');
          return res;
        })
      ;
    })
  ;
}

export default function elasticInit () {
  winston.info('[ELASTIC] >>>> init elasticsearch');

  return Promise.join(
    getEsTypes(),
    createIndexIfNeeded(),
    _.identity
  )
    .map((Type) => {
      return Type.createOrUpdateMapping();
    })
    .return('')
    .tap(winston.info.bind(winston, '[ELASTIC] >>>> Mapping created/updated!'))
  ;
};
