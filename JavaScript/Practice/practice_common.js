// 1. Оператор typeof

console.log(typeof NaN); // number
console.log(typeof null); // object
console.log(typeof []); // object
console.log(typeof Array); // function
console.log(typeof (() => {})); // function
console.log(typeof Function); // function

// 2. var, let, const

// 2.1

var a = 1;
console.log(a); // 1

/** iife - создаём область видимости
 * - переменная a в ней не определена
 * - ищем a в глобальной области
 * - перезаписываем глобальную переменную
 */
(function() {
  console.log(a); // 1
  a = 2;
})();

/** iife - создаём область видимости
 * - переменная a в ней определена через var
 * - var всплывает внутри функциональной области
 * - так как a определена и всплыла выводим undefined
 * - присваиваем локальной a значение 2
 */

(function() {
  console.log(a); // undefined
  var a = 3;
})();

/** выводим глобальную a */

console.log(a); // 2

/** iife - создаём область видимости
 * - переменная a в ней определена через let
 * - let не всплывает внутри функциональной области (вернее всплывает, но попадает в temporary dead zone)
 * - так как a определена, но не всплыла, пытаемся обратиться к локальной a и получаем reference error
 * - присваиваем локальной a значение 4
 */

(function() {
  console.log(a); // reference error
  let a = 4;
})();

/** выводим глобальную a */

console.log(a); // 2

// 2.2

/** iife - создаём область видимости
 * - вызываем функцию f
 * - так как f объявлена с помощью function declaration, то её можно вызвать до объявления - она всплывает
 * - выполняется f, в консоль выводим 1
 * - присваиваем f новую функцию
 * - вызываем f снаружи iife
 * - так как переприсвоили f новую функцию, выполняем её и в консоль выводим 1
 */

(function() {
	f(); // 2
	f = function() {
		console.log(1);
	}
})();

f(); //1

function f() {
	console.log(2);
}


// 3. == vs ===, falsy значения?

console.log([] == []); // ?
console.log([] === []); // ?

console.log({} == {}); // ?
console.log({} === {}); // ?

console.log('' == 0); // ?
console.log('' == null); // ?
console.log('' == undefined); // ?
console.log(0 == null); // ?
console.log(0 == undefined); // ?

console.log(NaN == NaN); // ?
console.log(NaN === NaN); // ?
console.log(null == undefined); // ?
console.log(undefined == null); // ?


// 4. Логические операторы
console.log(true || false); // ?
console.log(1 || false); // ?
console.log(0 || false); // ?
console.log('string' || false); // ?
console.log(0 || false || 'string' || 1); // ?
console.log(false || 0 && 5); // ?
console.log(true || 1 && 5); // ?
console.log(true && false); // ?
console.log(false && true); // ?
console.log(1 && 0 && 5); // ?
console.log(1 && 5 || 7); // ?

// 5. Прототипы

console.log(({}).prototype === ({}).__proto__); // ?

function fn1() {}
function fn2() {}

console.log(fn1.prototype === fn1.__proto__); // ?
console.log(fn1.prototype === fn2.prototype); // ?
console.log(fn1.__proto__ === fn2.__proto__); // ?

const num = 100;
console.log(num.prototype === Number.prototype); // ?
console.log(num.__proto__ === Number.prototype); // ?

class SomeClass {}
const SomeEl = new SomeClass();

console.log(SomeClass.__proto__ === Function.prototype); // ?
console.log(SomeEl.__proto__ === SomeClass.__proto__); // ?
console.log(SomeEl.__proto__ === SomeClass.prototype); // ?

// 6. Контекст

var name = 'John';

const obj = {
  name: 'Colin',
  prop: {
    name: 'Rox',
    getname: function() {
      return this.name;
    },
    arrow: () => this.name,
    iife: function() {
      (function() {
        console.log(this.name);
      })()
    },
    arrowInsideFunction: function() {
      return () => console.log(this.name);
    }
  }
}

console.log(obj.prop.getname()); // ?

const test = obj.prop.getname;
console.log(test()); // ?

console.log(test.call(obj.prop)); // ?
console.log(test.apply(obj)); // ?
console.log(test.bind(obj)); // ?
console.log(test.bind(obj).bind(obj.prop)()); // ?
console.log(obj.prop.arrow()); // ?

obj.prop.iife(); // ?
obj.prop.arrowInsideFunction()(); // ?

// 7. Promise, EventLoop

// 7.1
console.log(1);

const a = new Promise((resolve) => {
	console.log(2);
	resolve();
})

setTimeout(() => {
	console.log(3);
})

a.then(() => console.log(4));

console.log(5);

// 7.2
console.log(1);

const a = new Promise((resolve, reject) => {
	console.log(2);
	reject();
});

setTimeout(() => {
	console.log(3);
});

a.then(() => console.log(4))
.catch(() => console.log(5))
.catch(() => console.log(6))
.then(() => console.log(7));

console.log(8);

// 7.3
let n = 0;
while (++n < 5) {
	setTimeout(() => console.log(n), 10 + n); // ?
}
