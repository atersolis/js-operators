const partial = Symbol("partial");
const param = Symbol("param");

Object.defineProperty(Object.prototype, partial, {
	value: function partial(...args) {
		return (...pargs) => {
			// Replace the 'param' symbols by actual argument
			let rargs = []; rargs.length = args.length;
			let counter = 0;
			for(let i = 0; i < args.length; i++) {
				if(args[i] === param) {
					rargs[i] = pargs[counter];
					counter++;
				} else {
					rargs[i] = args[i];
				}
			}
			return this(...rargs);
		};
	},
	writable: false
});

module.exports = {
	partial,
	param
};
