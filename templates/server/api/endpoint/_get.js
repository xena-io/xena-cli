'use strict';

import <%= _.capitalize(_.humanize(name)) %> from './<%= name %>.object';

export default {
  method: 'GET',
  path: '/stories/{id}',
  handler: (req, res) => {
    return <%= _.capitalize(_.humanize(name)) %>.get(req.params.id)
      .then(res => res(res).code(200))
    ;
  }
};
