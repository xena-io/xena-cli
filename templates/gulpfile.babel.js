'use strict';

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';

gulp.task('serve', () => {
  nodemon({
    script: 'server/server.js',
    ignore: 'client/*',
    exec: 'babel-node'
  })
});
