const gulp = require('gulp');

const liveReload = require('./gulp-tasks/live-reload');

// # DEFAULT
{
  const task = {
    name: 'default',
    deps: ['live-reload'],
  };

  gulp.task(task.name, task.deps);
}

// # live-reload
{
  const task = {
    name: 'live-reload',
    fn: liveReload,
  };

  gulp.task(task.name, task.fn);
}
