const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const { Configuration } = require('webpack');
/**
 * @description webpack智能提示
 * @type {Configuration}
 */
module.exports = {
	mode: 'development',
	devtool: false,
	entry: path.resolve(__dirname, './src/index.js'),
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'bundle.js',
		// 必须指定产物的完整路径，否则使用方无法正确加载产物资源
		publicPath: `http://localhost:9001/`,
	},
	plugins: [
		new ModuleFederationPlugin({
			// MF 应用名称
			name: 'app1',
			// MF 模块入口，可以理解为该应用的资源清单
			// 通过 http://localhost:9001/remoteEntry.js 可以访问到该文件
			filename: `remoteEntry.js`,
			// 定义应用导出哪些模块
			exposes: {
				'./utils': './src/utils',
			},
		}),
		new HtmlWebpackPlugin({
			template: './index.html',
		}),
	],
	// MF 应用资源提供方必须以 http(s) 形式提供服务
	// 所以这里需要使用 devServer 提供 http(s) server 能力
	devServer: {
		port: 9001,
		hot: true,
		static: './',
	},
};
