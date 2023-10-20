// Webpack 允许在 Loader 函数上挂载名为 pitch 的函数，运行时 pitch 会比 Loader(normal) 本身更早
// Loader 链条执行过程分三个阶段：pitch、解析资源、执行（normal），设计上与 DOM 的事件模型非常相似，pitch 对应到捕获阶段；执行对应到冒泡阶段；而两个阶段之间 Webpack 会执行资源内容的读取、解析操作，对应 DOM 事件模型的 AT_TARGET 阶段：

// Pitching 过程，loaders的pitching过程从前到后（loader1 -> 2 -> 3）
// Normal 过程, loaders的normal过程从后到前（loader3 -> 2 -> 1）
const loader = function (source) {
	// console.log(source);
	// console.log('后执行');
	const json = JSON.stringify(source)
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');

	const esModule = true;
	return `${esModule ? 'export default' : 'module.exports ='} ${json};`;
};

// remainingRequest : 当前 loader 之后的资源请求字符串；
// previousRequest : 在执行当前 loader 之前经历过的 loader 列表；
// data : 与 Loader 函数的 data 相同，用于传递需要在 Loader 传播的信息。
loader.pitch = function (remainingRequest, previousRequest, data) {
	// console.log('先执行');
	// console.log(remainingRequest, previousRequest, data);
};

module.exports = loader;
