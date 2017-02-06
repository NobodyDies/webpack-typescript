const gulp = require('gulp');
const gutil = require('gutil');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const log = require('gutil-color-log');

gulp.task('webpack', (done) => {
	webpack(webpackConfig).run(onBuild(done))
})

function onBuild(done) {
	return function(err, stats) {
		if (err) {
			log('red', 'Error', err);
			if (done) {
				done();
			}
		} else {
			Object.keys(stats.compilation.assets).forEach(function(key) {
				gutil.log('Webpack: output ', log('green', key));
			});
			gutil.log('Webpack: ', log('red', 'finished ', stats.compilation.name));
			if (done) {
				done();
			}
		}
	}
}