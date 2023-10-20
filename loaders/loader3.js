// loader1.js中输出的是loader1， loader2.js中输出的是loader2，loader3.js输出loader3
module.exports = function (source, options) {
	const str = '\n  console.log("loader3");';
	console.log('executed in loader3');
	return source + str;
};
module.exports.pitch = function (remainingRequest, precedingRequest, data) {
	console.log(
		'executed in loader3.pitch'
		// remainingRequest,
		// precedingRequest,
		// data
	);
	// return 'console.log("loader3.pitch");';
};
