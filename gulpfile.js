(function () {
	var gulp = require('gulp');
	var sass = require('gulp-sass');
	var autoprefixer = require('gulp-autoprefixer');
	const browserSync = require('browser-sync');
	var nodemon = require('gulp-nodemon');
	var watch = require('gulp-watch');

	gulp.task('serve', function () {
		nodemon({
			script: 'server.js',
			ext: 'js html',
			env: {
				'NODE_ENV': 'development'
			}
		});
		
		gulp.task('sass', function () {
			return gulp
				.src('sass/*.scss')
				.pipe(sass({
					includePaths: ['./bower_components']
				}))
				.pipe(autoprefixer({
					browsers: ['last 2 version', '> 5%']
				}))
				.pipe(gulp.dest('./public/css'));
		});

		gulp.watch("**/*.scss", ['sass']);
		gulp.watch("**/*.html").on('change', browserSync.reload);
	})

	gulp.task('default', ['sass']);
})();
