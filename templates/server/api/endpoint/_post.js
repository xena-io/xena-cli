'use strict';

import <%= _.capitalize(_.humanize(name)) %> from './<%= name %>.object';

export default {
  method: 'POST',
  path: '/stories',
  handler: (req, res) => {
    var <%= name %> = new <%= _.capitalize(_.humanize(name)) %>();
    return <%= name %>
      .import(req.payload)
      .call('save')
      .then(res => res(res).code(200))
    ;
  }
};
