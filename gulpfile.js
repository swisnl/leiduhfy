
var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var config = {

	scripts: [
		'src/start.js',
		//'node_modules/domready/ready.js',
		//'node_modules/findandreplacedomtext/src/___findAndRepl___.js',
		'src/leiduhfy.js',
		'src/stop.js'
	]
};

gulp.task('build-js', function () {
	var name = 'leiduhfy';

	gulp.src(config.scripts)
		.pipe(concat(name + '.js'))
		.pipe(gulp.dest(''))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(''));

});
