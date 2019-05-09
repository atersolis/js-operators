const Vector2d = require("./Vector2d");
const { plus, dot } = Vector2d;
const { compose: o } = require("./functions/compose");
const { partial: x, param: _ } = require("./functions/partial");
const { pipe: p } = require("./functions/pipe");
const { bind: b, bind2: d } = require("./functions/bind");

// ======================================================
//                 Operations on vectors
// ======================================================
let u = new Vector2d(1, 3);
let v = new Vector2d(-1, 2);
let w = new Vector2d(2, 5);

// Okay, here I prefer the first syntax
let s1 = w.dot(u.plus(v).plus(w));
let s2 = (w) [dot] ((u) [plus] (v) [plus] (w));
// 54, 54
console.log(s1, s2);

// Things get more interresting from here
// ======================================================
//                  Function composition
// ======================================================
let upperCase = str => str.toUpperCase();
let bold = str => `** ${str} **`;
let h1 = str => `# ${str}`;

let importantTitle = (h1) [o] (bold) [o] (upperCase);
// # ** HELLO WORLD **
console.log(importantTitle("hello world"));

// ======================================================
//                  Partial functions
// ======================================================
let concat3 = (a, b, c) => `${a}${b}${c}`;
let comma = concat3[x](_, ",", _);
// foo,bar
console.log(comma("foo", "bar"));

// ======================================================
//                  Function pipe
// ======================================================
let myTitle = "hello world"
	[p] (upperCase)
	[p] (bold)
	[p] (h1);

// # ** HELLO WORLD **
console.log(myTitle);

/* With the pipe operator it would be :
let myTitle = "hello world"
	|> upperCase
	|> bold
	|> h1;
*/

// Together with partial

let myTitle2 = "hello world"
	[p] (upperCase)
	[p] (concat3[x]("** ", _, " **"))
	[p] (h1);

// # ** HELLO WORLD **
console.log(myTitle2);

/* With the pipe operator and the partial operator it would be:
let myTitle = "hello world"
	|> upperCase
	|> concat3('** ', ?, ' **')
	|> h1;
**/

// ======================================================
//                    Function bind
// ======================================================
function rotate(ang) {
	let [cos, sin] = [Math.cos(ang), Math.sin(ang)];
	let [x, y] = [this.x * cos - this.y * sin, this.x * sin + this.y * cos];
	this.x = parseFloat(x.toFixed(5)); 
	this.y = parseFloat(y.toFixed(5));
	return this;
}

function translate(x, y) {
	this.x += x;
	this.y += y;
	return this;
}

function scale(s) {
	this.x *= s;
	this.y *= s;
	return this;
}

function print() {
	console.log(`(${this.x}; ${this.y})`);
	return this;
}

let vec = new Vector2d(1, 0);
vec [b] (rotate)(Math.PI / 2)
	 [b] (scale)(2)
	 [b] (translate)(1, 1)
	 [b] (print)();
// (1; 3)

// Or if you prefer
let vec2 = new Vector2d(1, 0);
vec2 [d] (rotate, Math.PI / 2)
	  [d] (scale, 2)
	  [d] (translate, 1, 1)
	  [d] (print);
// (1; 3)

/* With the bind operator it would be:
let vec = new Vector2d(0, 1);
vec::rotate(Math.PI / 2)
	::scale(2)
	::translate(1, 1);
	::print();
*/
