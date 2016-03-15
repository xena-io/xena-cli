'use strict';

import <%= _.capitalize(_.humanize(name)) %> from './<%= name %>.object';

export default {
  method: 'GET',
  path: '/stories',
  handler: (request, reply) => {
    return <%= _.capitalize(_.humanize(name)) %>.search({
      from: +(request.query.from) || undefined,
      size: +(request.query.size) || undefined,
    })
      .then(res => {
        reply(res.elements)
          .code(200)
          .header('Accept-Ranges', 'users')
          .header('Content-Range', 'users ' + request.query.from + '-' + (request.query.from + request.query.size) + '/' + stories.total)
        ;
      })
    ;
  }
};
