const pipe = Symbol("pipe");

Object.defineProperty(Object.prototype, pipe, {
	value: function pipe(func) {
		return func(this);
	},
	writable: false
});

module.exports = {
	pipe
};
