const nodemon = require('gulp-nodemon');

const liveReload = function() {
  const configuration = {
    // File name gulp is going to run with the command 'node <file_name>'.
    script: './index.js',

    // File extensions that gulp is going to watch for changes and then automatically restart our app to tear then up.
    ext: 'js',

    // Gulp is not going to restart the server when whatever changes happens to the 'node_modules' directory.
    ignore: ['./node_modules/**']
  };
  const event = 'restart';
  const callback = function() {
    // Callback which will be executed whenever a changes occur to our project.
    console.info('# Restarting server due to new changes.');
  };

  nodemon(configuration)
    .on(event, callback);
}

module.exports = liveReload;
