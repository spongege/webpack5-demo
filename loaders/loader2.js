// loader1.js中输出的是loader1， loader2.js中输出的是loader2，loader3.js输出loader3
module.exports = function (source, options) {
	const str = '\n  console.log("loader2");';
	console.log('executed in loader2');
	return source + str;
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
	console.log(
		'executed in loader2.pitch'
		// remainingRequest,
		// precedingRequest,
		// data
	);
	// return 'console.log("loader2.pitch");';
};
