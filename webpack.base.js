const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Configuration } = require('webpack');
/**
 * @description webpack智能提示
 * @type {Configuration}
 */

module.exports = {
	output: {
		filename: '[name].[contenthash].js',
		path: path.join(__dirname, './dist'),
	},
	resolve: {
		extensions: ['.vue', '.js'],
	},
	module: {
		rules: [{ test: /.vue$/, use: 'vue-loader' }],
	},
	plugins: [new VueLoaderPlugin()],
};
