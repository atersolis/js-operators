const bind = Symbol("bind");
const bind2 = Symbol("bind2");

Object.defineProperty(Object.prototype, bind, {
	value: function bind(func) {
		return func.bind(this);
	},
	writable: false
});

Object.defineProperty(Object.prototype, bind2, {
	value: function bind2(func, ...args) {
		return func.bind(this)(...args);
	},
	writable: false
});

module.exports = {
	bind,
	bind2
};
