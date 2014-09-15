pkg    = require('./package.json');
gulp   = require('gulp');
coffee = require('gulp-coffee');
util   = require('gulp-util');
mocha = require('gulp-mocha');
watch = require('gulp-watch');

source = [
  'src/dendroid.coffee'
];

gulp.task('build', function() {
  gulp.src(source)
    .pipe(coffee().on('error', util.log))
    .pipe(gulp.dest('dist'))
});

gulp.task('test', function() {
	return gulp.src('test/test.js', {read: false})
		.pipe(mocha({reporter: 'spec'}));
});

gulp.task('default', function () {
	gulp.watch(source, ['build', 'test'])
});
