const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
	},
	plugins: [
		// 模块使用方也依然使用 ModuleFederationPlugin 插件搭建 MF 环境
		new ModuleFederationPlugin({
			name: 'app2',
			// 使用 remotes 属性声明远程模块列表
			remotes: {
				// 地址需要指向导出方生成的应用入口文件
				remoteApp1: 'app1@http://localhost:9001/remoteEntry.js',
			},
		}),
		new HtmlWebpackPlugin({
			template: './index.html',
		}),
	],
	devServer: {
		port: 9002,
		hot: true,
		open: true,
		static: './',
	},
};
