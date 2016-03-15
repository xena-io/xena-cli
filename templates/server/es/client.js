'use strict';

import elasticsearch from 'elasticsearch';
import conf from '../config/environment';
import Promise from 'bluebird';

const client = new elasticsearch.Client({
  host: conf.elastic.host,
  index: conf.elastic.host,
  defer: Promise.defer,
});

export default client;
