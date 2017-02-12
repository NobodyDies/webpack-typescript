const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LocalePlugin = require('./build/LocalePlugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const extractCSS = new ExtractTextPlugin({
	filename: '../css/[name].css',
	allChunks: true
});

const extractJSON = new ExtractTextPlugin({
	filename: '[name].locale.json',
	allChunks: true
});

const localePlugin = new LocalePlugin({
	paths: [path.resolve(__dirname, '**/*.locale.json')],
	outputDirectory: 'locale',
	outputFileName: '[key]'
});

module.exports = {

	// set the context (optional)
	context: path.join(__dirname, '/src'),
	entry: 'app/index',
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
							options: {
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				})
			},

			// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
			{
				test: /\.ts$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							plugins: ['transform-runtime'],
							presets: ['es2015']
						}
					},{
						loader: "ts-loader"
					}
				]
				//'?optional[]=runtime!'
			},
			{
				test: /\.pug$/,
				loaders: ['pug-loader']
			},
			{
				test: /\.yaml/,
				loader: ExtractTextPlugin.extract({
					use: LocalePlugin.loader()
				})
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new CopyWebpackPlugin([
			// {
			// 	from: './index.html',
			// 	to: path.resolve(__dirname, 'dist/index.html')
			// }
		], {
			copyUnmodified: true
		}),
		extractCSS,
		extractJSON,
		localePlugin,
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false,
		// 		drop_console: true,
		// 		unsafe: true
		// 	}
		// }),
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common'
		}),
		new HtmlWebpackPlugin({
			template: './templates/news/index.pug'
		}),
		new HtmlWebpackPlugin({
			template: './templates/news/item.pug'
		})
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
	},
	resolveLoader: {
		modules: ['node_modules', 'build']
	},
};