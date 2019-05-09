# You can create your own operators with es6 ... well kind of - or Yet another way you can use Symbols
**The "kind of" is probably the most important part...**

It's not rare to see people complaining about how scarce javascript's standard lib is.
I mean, even a basic method like Array's `flatMap` was added only recently.
So it seems very tempting to extend js's built-in objects with custom methods.
But I probably don't need to explain why this is a VERY bad idea:

```javascript
Object.prototype.set = function(key, value) {
	this[key] = value;
}

let obj = { foo: 'foo', bar: 'bar' };

obj.set('hello', 'world');

for(let key of obj) {
	console.log(key);
}
// foo
// bar
// hello
// set //Oops
```
1. All our objects get poluted with a new key
2. It doesn't play well with ESModules :
   1. You can't control what happens in other modules, so if someone decides to add `set` to `Object`
	one of the methods gets overloaded and your code turns into a mess.
   2. You quickly can't remember in which module that custom method was defined, and your IDE can't help you.

Hopefully, one day we will get awesome features like the [bind operator](https://github.com/tc39/proposal-bind-operator) or the [pipe operator](https://github.com/tc39/proposal-pipeline-operator) but right now they are in stage 0 and stage 1...

In the meanwhile we can do this:
- Use `Object​.define​Property()` solve problem 1
- Use `Symbol` to solve problem 2
Like this:

```javascript
// ---------------------------------
// ---------- lib/myLib.js ---------
// ---------------------------------
const set = Symbol('set');

Object.defineProperty(Object.prototype, set, {
  value: function set(key, value) {
	  this[key] = value;
  },
  writable: false
});

module.exports = { set };

// ---------------------------------
// ---------- myScript.js ----------
// ---------------------------------
const set = require('./lib/myLib.js');

let obj = {
	foo: "foo",
	bar: "bar"
};

obj[set]('hello', 'world');
// With the bind operator, it would be as simple as that:
// function set(key, value) { this[key] = value }
// obj::set('hello', 'world');

for(let key of obj) {
	console.log(key);
}

// foo
// bar
// hello
```

While it's a hack, it's pretty interresting in my opinion.
Though I'm pretty sure someone came up with it long before I did and wrote a much better article about it.
The reason I created this repository to point out that you can do this kind of stuff with it:
(It can look and behave like an operator, hence the title)

```javascript
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
```

Yes the brackets and parenthesis are a pain, but it kind of behave like an operator, don't you think ?

**Note 1: if you're worried about the performance, you can turn those hacks into babel macros.**
**Note 2: you can use a wide range of utf8 symbols for js variable names
  (just google 'javascript legal characters variable names') so you can pick a letter
  that actually looks like an operator. I'm not sure if that's a good idea though.**