var gulp = require('gulp');
var inlineNg2Template = require('gulp-inline-ng2-template');

// "process.env.PWD" is the working directory when the process was started
// gulp changes dir to the path of the gulp file. let's change it back:
process.chdir(process.env.PWD)
let SRC = process.env.PWD + '/src';
let DEST = process.env.PWD + '/js';

console.log('>>> Working directory is now: ' + process.cwd())

/**
 * First we copy all images & html files from src/ to js/
 */
gulp.task('copy', function() {
  console.log(`>>> 1. Copy images&html files from ${SRC} to ${DEST}`);

  return gulp.src(`${SRC}/**/*.{html,gif,jpg,jpeg,png,svg}`)
    .pipe(gulp.dest(DEST));
});

/**
 * Then we inline all templates
 */
gulp.task('after-build', ['copy'], function() {
  console.log(`>>> 2. Inline angular template content`);

  return gulp.src(`${DEST}/**/*.js`)
    .pipe(inlineNg2Template({
      base: '/js',
      useRelativePaths: true
    }))
    .pipe(gulp.dest(DEST));
});
