// server.js
/* 
可以看出，Node 服务的核心逻辑在于：
调用 entry-server.js 导出的工厂函数渲染出 Vue 组件结构；
调用 @vue/server-renderer 将组件渲染为 HTML 字符串；
拼接 HTML 内容，将组件 HTML 字符串与 entry-client.js 产物路径注入到 HTML 中，并返回给客户端。
*/
const express = require('express');
const path = require('path');
const { renderToString } = require('@vue/server-renderer');

// 通过 manifest 文件，找到正确的产物路径
const clientManifest = require('./dist/manifest-client.json');
const serverManifest = require('./dist/manifest-server.json');
const serverBundle = path.join(
	__dirname,
	'./dist',
	serverManifest['server.js']
);
// 这里就对标到 `entry-server.js` 导出的工厂函数
const createApp = require(serverBundle).default;

const server = express();

server.get('/', async (req, res) => {
	const app = createApp();

	const html = await renderToString(app);
	const clientBundle = clientManifest['client.js'];
	res.send(`
<!DOCTYPE html>
<html>
    <head>
      <title>Vue SSR Example</title>
    </head>
    <body>
      <!-- 注入组件运行结果 -->
      <div id="app">${html}</div>
      <!-- 注入客户端代码产物路径 -->
      <!-- 实现 Hydrate 效果 -->
      <script src="${clientBundle}"></script>
    </body>
</html>
    `);
});

server.use(express.static('./dist'));

server.listen(3000, () => {
	console.log('ready');
});
