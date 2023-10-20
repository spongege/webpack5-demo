// Webpack 允许在 Loader 函数上挂载名为 pitch 的函数，运行时 pitch 会比 Loader(normal) 本身更早
// Loader 链条执行过程分三个阶段：pitch、解析资源、执行（normal），设计上与 DOM 的事件模型非常相似，pitch 对应到捕获阶段；执行对应到冒泡阶段；而两个阶段之间 Webpack 会执行资源内容的读取、解析操作，对应 DOM 事件模型的 AT_TARGET 阶段：

// Pitching 过程，loaders的pitching过程从前到后（loader1 -> 2 -> 3）
// Normal 过程, loaders的normal过程从后到前（loader3 -> 2 -> 1）

// loader1.js中输出的是loader1， loader2.js中输出的是loader2，loader3.js输出loader3
module.exports = function (source, options) {
	const str = '\n  console.log("loader1");';
	console.log('executed in loader1');
	return source + str;
};
// remainingRequest : 当前 loader 之后的资源请求字符串；
// previousRequest : 在执行当前 loader 之前经历过的 loader 列表；
// data : 与 Loader 函数的 data 相同，用于传递需要在 Loader 传播的信息。
module.exports.pitch = function (remainingRequest, precedingRequest, data) {
	console.log(
		'executed in loader1.pitch'
		// remainingRequest,
		// precedingRequest,
		// data
	);
	/* 
    inline loader npx webpack后执行顺序：
    executed in loader1.pitch
    executed in loader2.pitch
    executed in loader3.pitch
    executed in loader3
    executed in loader2
  */
	return `require('!!../loaders/loader2.js!../loaders/loader3.js!./loadertest.js')`; // return一个inline-loader的调用
};
