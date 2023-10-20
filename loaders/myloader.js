const { validate } = require('schema-utils');
const schema = require('./options.json');

const loader = function (source) {
	const options = this.getOptions();

	// 调用 schema-utils 完成校验
	const res = validate(schema, options);
	console.log(res);

	const json = JSON.stringify(source)
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');

	const esModule = true;
	return `${esModule ? 'export default' : 'module.exports ='} ${json};`;
};

// remainingRequest : 当前 loader 之后的资源请求字符串；
// previousRequest : 在执行当前 loader 之前经历过的 loader 列表；
// data : 与 Loader 函数的 data 相同，用于传递需要在 Loader 传播的信息。
loader.pitch = function (remainingRequest, previousRequest, data) {};

module.exports = loader;
