'use strict';

export default {
  env: 'development',
  host: 'localhost',
  staticDir: path.join(__dirname, '../dev')

  elastic: {
    host: 'http://localhost:9200',
    indices: [<% _.forEach(indices, function(index, i) { %>'<%- index %>'<% if(i !== indices.length - 1) { %>, <% } %><% }); %>],
    number_of_shards: <%= shards %>,
    number_of_replicas: <%= replicas %>
  }
};
