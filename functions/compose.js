const compose = Symbol("compose");

Object.defineProperty(Function.prototype, compose, {
	value: function compose(func) {
		return (...args) => this(func(...args));
	},
	writable: false
});

module.exports = {
	compose
};
