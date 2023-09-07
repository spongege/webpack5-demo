/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Configuration } = require('webpack');
/**
 * @description webpack智能提示
 * @type {Configuration}
 */

module.exports = {
	entry: './src/index.ts',
	mode: 'development',
	devtool: false,
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$|\.ts$/,
				// SWC 在单线程情况下比 Babel 块 20 倍，四核下要快 70 倍。
				use: 'swc-loader',
			},
			// {
			// 	test: /\.js$|\.ts$/,
			// 	use: {
			// 		loader: 'babel-loader',
			// 		options: {
			// 			// presets: ['@babel/preset-env', '@babel/preset-typescript'],
			// 			presets: ['@babel/preset-typescript'],
			// 		},
			// 	},
			// },
			// mini-css-extract-plugin 库同时提供 Loader、Plugin 组件，需要同时使用
			// mini-css-extract-plugin 不能与 style-loader 混用，否则报错，所以上述示例中第 9 行需要判断 process.env.NODE_ENV 环境变量决定使用那个 Loader
			// mini-css-extract-plugin 需要与 html-webpack-plugin 同时使用，才能将产物路径以 link 标签方式插入到 html 中
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		// 根据运行环境判断使用那个 loader
			// 		process.env.NODE_ENV === 'development'
			// 			? 'style-loader'
			// 			: MiniCssExtractPlugin.loader,
			// 		'css-loader',
			// 	],
			// },
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								// 添加 autoprefixer 插件
								plugins: [require('autoprefixer')],
							},
						},
					},
					'less-loader',
				],
			},
		],
	},
	plugins: [
		new ESLintPlugin({ extensions: ['.js', '.ts'] }),
		new MiniCssExtractPlugin(),
		new HTMLWebpackPlugin(),
	],
	devServer: {
		//本地调试服务配置
		port: 80, //端口
		host: '0.0.0.0', //局域网访问可填写'0.0.0.0'
		hot: true, //启动热更新
		filename: 'main.js', //入口文件引入
		contentBase: path.join(__dirname, 'src'), //映射资源目录位置
	},
};
