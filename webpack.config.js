/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Configuration } = require('webpack');
/**
 * @description webpack智能提示
 * @type {Configuration}
 */

module.exports = {
	entry: {
		import: path.join(__dirname, './src/index.ts'),
		// runtime: 'common-runtime',
	},
	// entry: './src/index.vue',
	mode: 'development',
	devtool: false,
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	// 不把vue代码打包进去
	// externals: {
	// 	vue: 'Vue',
	// },
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
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.vue$/,
				use: 'vue-loader',
			},
		],
	},
	plugins: [
		new ESLintPlugin({ extensions: ['.js', '.ts'] }),
		new MiniCssExtractPlugin(),
		new HTMLWebpackPlugin({
			templateContent: `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
					<title>Webpack App</title>
				</head>
				<body>
					<div id="app" />
				</body>
			</html>
					`,
		}),
		new VueLoaderPlugin(),
	],
	devServer: {
		//本地调试服务配置
		port: 80, //端口
		hot: true, //启动热更新
		open: false, //自动打开浏览器
	},
	optimization: {
		/* 
		设置runtimeChunk是将包含chunks 映射关系的 list单独从 app.js里提取出来，因为每一个 chunk 的 id 基本都是基于内容 hash 出来的，所以每次改动都会影响它，如果不将它提取出来的话，等于app.js每次都会改变。缓存就失效了。设置runtimeChunk之后，webpack就会生成一个个runtime~xxx.js的文件。
		
		然后每次更改所谓的运行时代码文件时，打包构建时app.js的hash值是不会改变的。如果每次项目更新都会更改app.js的hash值，那么用户端浏览器每次都需要重新加载变化的app.js，如果项目大切优化分包没做好的话会导致第一次加载很耗时，导致用户体验变差。现在设置了runtimeChunk，就解决了这样的问题。所以这样做的目的是避免文件的频繁变更导致浏览器缓存失效，所以其是更好的利用缓存。提升用户体验。
		 */
		runtimeChunk: 'single',
		/* 
		SplitChunksPlugin 的用法比较抽象，算得上 Webpack 的一个难点，主要能力有：
			SplitChunksPlugin 支持根据 Module 路径、Module 被引用次数、Chunk 大小、Chunk 请求数等决定是否对 Chunk 做进一步拆解，这些决策都可以通过 optimization.splitChunks 相应配置项调整定制，基于这些能力我们可以实现：
			单独打包某些特定路径的内容，例如 node_modules 打包为 vendors；
			单独打包使用频率较高的文件；
			SplitChunksPlugin 还提供了 optimization.splitChunks.cacheGroup 概念，用于对不同特点的资源做分组处理，并为这些分组设置更有针对性的分包规则；
			SplitChunksPlugin 还内置了 default 与 defaultVendors 两个 cacheGroup，提供一些开箱即用的分包特性：
				node_modules 资源会命中 defaultVendors 规则，并被单独打包；
				只有包体超过 20kb 的 Chunk 才会被单独打包；
				加载 Async Chunk 所需请求数不得超过 30；
				加载 Initial Chunk 所需请求数不得超过 30。
		*/
		/* 
		Chunk 是 Webpack 实现模块打包的关键设计，Webpack 会首先为 Entry 模块、异步模块、Runtime 模块(取决于配置) 创建 Chunk 容器，之后按照 splitChunks 配置进一步优化、裁剪分包内容。
		
		splitChunks 配置项与最佳实践:
		
		minChunks：用于设置引用阈值，被引用次数超过该阈值的 Module 才会进行分包处理；
		maxInitialRequest/maxAsyncRequests：用于限制 Initial Chunk(或 Async Chunk) 最大并行请求数，本质上是在限制最终产生的分包数量；
		minSize： 超过这个尺寸的 Chunk 才会正式被分包；
		maxSize： 超过这个尺寸的 Chunk 会尝试继续做分包；
		maxAsyncSize： 与 maxSize 功能类似，但只对异步引入的模块生效；
		maxInitialSize： 与 maxSize 类似，但只对 entry 配置的入口模块生效；
		enforceSizeThreshold： 超过这个尺寸的 Chunk 会被强制分包，忽略上述其它 size 限制；
		cacheGroups：用于设置缓存组规则，为不同类型的资源设置更有针对性的分包策略。
		结合这些特性，业界已经总结了许多惯用的最佳分包策略，包括：

		针对 node_modules 资源：
		可以将 node_modules 模块打包成单独文件(通过 cacheGroups 实现)，防止业务代码的变更影响 NPM 包缓存，同时建议通过 maxSize 设定阈值，防止 vendor 包体过大；
		更激进的，如果生产环境已经部署 HTTP2/3 一类高性能网络协议，甚至可以考虑将每一个 NPM 包都打包成单独文件，具体实现可查看小册示例；
		针对业务代码：
		设置 common 分组，通过 minChunks 配置项将使用率较高的资源合并为 Common 资源；
		首屏用不上的代码，尽量以异步方式引入；
		设置 optimization.runtimeChunk 为 true，将运行时代码拆分为独立资源。
		不过，现实世界很复杂，同样的方法放在不同场景可能会有完全相反的效果，建议你根据自己项目的实际情况(代码量、基础设施环境)，择优选用上述实践。
		*/
		splitChunks: {
			cacheGroups: {
				// test：接受正则表达式、函数及字符串，所有符合 test 判断的 Module 或 Chunk 都会被分到该组；
				// type：接受正则表达式、函数及字符串，与 test 类似均用于筛选分组命中的模块，区别是它判断的依据是文件类型而不是文件名，例如 type = 'json' 会命中所有 JSON 文件；
				// idHint：字符串型，用于设置 Chunk ID，它还会被追加到最终产物文件名中，例如 idHint = 'vendors' 时，输出产物文件名形如 vendors-xxx-xxx.js ；
				// priority：数字型，用于设置该分组的优先级，若模块命中多个缓存组，则优先被分到 priority 更大的组。
				vendor: {
					test: /node_modules/,
					// name: 'vendor',
					chunks: 'all',
					idHint: 'vendors',
				},
			},
		},
		minimize: true,
		minimizer: [
			// Webpack5 之后，约定使用 `'...'` 字面量保留默认 `minimizer` 配置
			'...',
			new TerserPlugin({
				// 将备注信息抽取为单独文件
				// extractComments: 'all',
				// 不单独抽取备注内容
				extractComments: false,
			}),
			// 需要使用 `mini-css-extract-plugin` 将 CSS 代码抽取为单独文件
			// 才能命中 `css-minimizer-webpack-plugin` 默认的 `test` 规则
			new CssMinimizerPlugin(),
		],
	},
};
