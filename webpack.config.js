const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV || 'development';

const package = require('./package.json');
const banner = package.name + ' v' + package.version;

const extractCSS = new ExtractTextPlugin({
	filename: '../css/[name].css',
	allChunks: true
});

module.exports = {

	// set the context (optional)
	context: path.join(__dirname, '/src'),
	entry: 'app/modules/index',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist/js')
	},
	// enable loading modules relatively (without the ../../ prefix)
	resolve: {
		modules: [path.resolve(__dirname, "src"), "node_modules"],
		extensions: ['.ts', '.webpack.js', '.web.js', '.js']
	},
	module: {
		loaders: [
			// load css and process sass
			{
				test: /\.scss$/,
				loader: extractCSS.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'postcss-loader',
							options: {}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'sass-resources-loader',
							options: {
								resources: path.resolve(__dirname, 'src/common_sass/bootstrap.scss')
							},
						}
					]
				})
			},
			{
				test: /\.ts$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							plugins: ['transform-runtime'],
							presets: ['es2015']
						}
					}, {
						loader: "ts-loader"
					}
				]
			},
			{
				test: /\.pug$/,
				loaders: ['html-loader', 'pug-html-loader']
			}
		]
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: banner,
			entryOnly: true
		}),
		new CleanWebpackPlugin(['dist']),
		extractCSS,
		/*new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true,
				unsafe: true
			}
		}),*/
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common'
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'node_modules/angular/angular.min.js'),
				to: path.resolve(__dirname, 'dist/assets/vendor/angular/angular.min.js')
			}
		])
	],

	// webpack dev server configuration
	devServer: {
		contentBase: "./dist",
		noInfo: false,
		inline: true
	},

	// support source maps
	devtool: NODE_ENV == 'development' ? "source-map" : 'false',
	watch: NODE_ENV == 'development',
	watchOptions: {
		aggregateTimeout: 100
	}
};