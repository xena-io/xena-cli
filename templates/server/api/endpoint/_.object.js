'use strict';

import esObject from 'esobject';
import client from '../../es/client';
import conf from '../../conf/environment';
import path from 'path';

var object = esObject.create({
  db: {
    client: client,
    index: conf.elastic.index,
    type: '<%= name %>',
  },
  mapping: path.join(__dirname, '<%= name %>.mapping.yaml'),
  import: {
    <% if(mappingExists) { %>
    <% for(var i = 0, l = fields.length; i < l; i++) { %>
    <%= fields[i].name %>: {$id: true},
    <% } %>
    <% } else {%>
    // declare fields here
    <% } %>
    _version: (esval, rawval) => {
      return rawval || 0;
    },
  },
  export: {
    _id: {$id: true},
    _version: {$id: true},
  },
});

export default object;
