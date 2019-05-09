class Vector2d {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	plus(v) {
		return new Vector2d(this.x + v.x, this.y + v.y);
	}

	dot(v) {
		return this.x * v.x + this.y * v.y;
	}
}

const dot = Symbol('dot');
const plus = Symbol('plus');

Object.defineProperty(Vector2d.prototype, dot, {
	value: Vector2d.prototype.dot,
	writable: false
});

Object.defineProperty(Vector2d.prototype, plus, {
	value: Vector2d.prototype.plus,
	writable: false
});

module.exports = Vector2d;
module.exports.dot = dot;
module.exports.plus = plus;