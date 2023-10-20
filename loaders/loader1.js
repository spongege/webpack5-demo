// loader1.js中输出的是loader1， loader2.js中输出的是loader2，loader3.js输出loader3
module.exports = function (source, options) {
	const str = '\n  console.log("loader1");';
	console.log('executed in loader1');
	return source + str;
};
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
