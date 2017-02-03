var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {

	// set the context (optional)
	context: path.join(__dirname, '/src'),
	entry: 'main',
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
			{test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass-loader"]},

			// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
			{test: /\.ts$/, loader: 'babel-loader!ts-loader'}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist'], {
			root: path.resolve(__dirname, '')
		}),
		new CopyWebpackPlugin([
			{
				from: './index.html',
				to: path.resolve(__dirname, 'dist/index.html')
			}
		], {
			copyUnmodified: true
		})
	],

	// webpack dev server configuration
	devServer: {
		contentBase: "./dist",
		noInfo: false,
		inline: true
	},

	// support source maps
	devtool: "source-map"
};