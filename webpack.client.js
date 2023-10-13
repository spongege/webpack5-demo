// webpack.client.js
const Merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const base = require('./webpack.base');
const BundleAnalyzerPlugin =
	require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Configuration } = require('webpack');
/**
 * @description webpack智能提示
 * @type {Configuration}
 */

// 继承自 `webpack.base.js`
module.exports = Merge.merge(base, {
	mode: 'development',
	entry: {
		// 入口指向 `entry-client.js` 文件
		client: {
			import: path.join(__dirname, './src/entry-client.js'),
			runtime: 'common-runtime',
		},
		foo: {
			import: path.join(__dirname, './src/foo.js'),
			// dependOn 适用于哪些有明确入口依赖的场景，例如我们构建了一个主框架 Bundle，其中包含了项目基本框架(如 React)，之后还需要为每个页面单独构建 Bundle，这些页面代码也都依赖于主框架代码，此时可用 dependOn 属性优化产物内容，减少代码重复
			dependOn: 'client',
			/* 
			为支持产物代码在各种环境中正常运行，Webpack 会在产物文件中注入一系列运行时代码，用以支撑起整个应用框架。运行时代码的多寡取决于我们用到多少特性，例如：
			需要导入导出文件时，将注入 __webpack_require__.r 等；
			使用异步加载时，将注入 __webpack_require__.l 等；
			等等。
			不要小看运行时代码量，极端情况下甚至有可能超过业务代码总量！为此，必要时我们可以尝试使用 runtime 配置将运行时抽离为独立 Bundle
			*/
			// runtime: 'common-runtime',
		},
	},
	output: {
		publicPath: '/',
		clean: true,
		// output.path：声明产物放在什么文件目录下；
		// output.filename：声明产物文件名规则，支持 [name]/[hash] 等占位符；
		// output.publicPath：文件发布路径，在 Web 应用中使用率较高；
		// output.clean：是否自动清除 path 目录下的内容，调试时特别好用；
		// output.library：NPM Library 形态下的一些产物特性，例如：Library 名称、模块化(UMD/CMD 等)规范；
		// output.chunkLoading：声明加载异步模块的技术方案，支持 false/jsonp/require 等方式。
	},
	module: {
		rules: [{ test: /\.css$/, use: ['style-loader', 'css-loader'] }],
	},
	plugins: [
		// 这里使用 webpack-manifest-plugin 记录产物分布情况
		// 方面后续在 `server.js` 中使用
		new WebpackManifestPlugin({ fileName: 'manifest-client.json' }),
		// 自动生成 HTML 文件内容
		new HtmlWebpackPlugin({
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
		// new BundleAnalyzerPlugin(),
	],
	// Webpack 内置了 stats 接口，专门用于统计模块构建耗时、模块依赖关系等信息
	profile: true,
});
